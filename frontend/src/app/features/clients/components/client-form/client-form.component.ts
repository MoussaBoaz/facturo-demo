import { Component, inject, signal, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Client, CreateClientRequest } from '../../models/client.model';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent {
  private fb = inject(FormBuilder);
  
  @Input() client: Client | null = null;
  @Input() loading = false;
  @Output() save = new EventEmitter<CreateClientRequest>();
  @Output() cancel = new EventEmitter<void>();
  
  clientForm: FormGroup;
  
  constructor() {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      company: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.minLength(8)]],
      address: ['']
    });
  }
  
  onSubmit() {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }
    this.save.emit(this.clientForm.value);
  }
  
  onCancel() {
    this.cancel.emit();
  }
}
