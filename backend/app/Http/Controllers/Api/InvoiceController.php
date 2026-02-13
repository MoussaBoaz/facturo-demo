<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Invoice::where('user_id', JWTAuth::user()->id)
            ->with(['client', 'items'])
            ->latest()
            ->paginate(20);
        
        return response()->json($invoices);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'client_id' => 'required|exists:clients,id',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'notes' => 'nullable|string',
            'terms' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = JWTAuth::user();
        
        // Calculate totals
        $subtotal = 0;
        foreach ($request->items as $item) {
            $subtotal += $item['quantity'] * $item['unit_price'];
        }
        
        $taxRate = $request->tax_rate ?? 21;
        $taxAmount = $subtotal * ($taxRate / 100);
        $total = $subtotal + $taxAmount;

        $invoice = Invoice::create([
            'user_id' => $user->id,
            'client_id' => $request->client_id,
            'invoice_number' => Invoice::generateInvoiceNumber(),
            'issue_date' => $request->issue_date,
            'due_date' => $request->due_date,
            'status' => Invoice::STATUS_DRAFT,
            'subtotal' => $subtotal,
            'tax_rate' => $taxRate,
            'tax_amount' => $taxAmount,
            'total' => $total,
            'notes' => $request->notes,
            'terms' => $request->terms,
        ]);

        foreach ($request->items as $item) {
            InvoiceItem::create([
                'invoice_id' => $invoice->id,
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'total' => $item['quantity'] * $item['unit_price'],
            ]);
        }

        return response()->json([
            'message' => 'Invoice created successfully',
            'invoice' => $invoice->load('items', 'client')
        ], 201);
    }

    public function show($id)
    {
        $invoice = Invoice::where('user_id', JWTAuth::user()->id)
            ->with(['client', 'items'])
            ->findOrFail($id);
        
        return response()->json($invoice);
    }

    public function update(Request $request, $id)
    {
        $invoice = Invoice::where('user_id', JWTAuth::user()->id)->findOrFail($id);
        
        if ($invoice->status === Invoice::STATUS_PAID) {
            return response()->json(['error' => 'Cannot edit a paid invoice'], 400);
        }

        $validator = Validator::make($request->all(), [
            'issue_date' => 'sometimes|date',
            'due_date' => 'sometimes|date',
            'status' => 'sometimes|in:draft,sent',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $invoice->update($request->only(['issue_date', 'due_date', 'status', 'notes']));

        return response()->json([
            'message' => 'Invoice updated successfully',
            'invoice' => $invoice->load('items', 'client')
        ]);
    }

    public function destroy($id)
    {
        $invoice = Invoice::where('user_id', JWTAuth::user()->id)->findOrFail($id);
        
        if ($invoice->status === Invoice::STATUS_PAID) {
            return response()->json(['error' => 'Cannot delete a paid invoice'], 400);
        }

        $invoice->delete();

        return response()->json(['message' => 'Invoice deleted successfully']);
    }

    public function send($id)
    {
        $invoice = Invoice::where('user_id', JWTAuth::user()->id)->findOrFail($id);
        
        if ($invoice->status !== Invoice::STATUS_DRAFT) {
            return response()->json(['error' => 'Invoice already sent'], 400);
        }

        $invoice->update(['status' => Invoice::STATUS_SENT]);

        // TODO: Send email with PDF

        return response()->json([
            'message' => 'Invoice sent successfully',
            'invoice' => $invoice
        ]);
    }

    public function dashboard()
    {
        $user = JWTAuth::user();
        
        $totalInvoices = Invoice::where('user_id', $user->id)->count();
        $totalPaid = Invoice::where('user_id', $user->id)
            ->where('status', Invoice::STATUS_PAID)
            ->sum('total');
        $totalPending = Invoice::where('user_id', $user->id)
            ->whereIn('status', [Invoice::STATUS_SENT, Invoice::STATUS_DRAFT])
            ->sum('total');
        $totalOverdue = Invoice::where('user_id', $user->id)
            ->where('status', Invoice::STATUS_SENT)
            ->where('due_date', '<', now())
            ->sum('total');

        $recentInvoices = Invoice::where('user_id', $user->id)
            ->with('client')
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'stats' => [
                'total_invoices' => $totalInvoices,
                'total_paid' => $totalPaid,
                'total_pending' => $totalPending,
                'total_overdue' => $totalOverdue,
            ],
            'recent_invoices' => $recentInvoices
        ]);
    }
}
