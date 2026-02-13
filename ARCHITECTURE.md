# 🏗️ Architecture Guidelines

## Angular 19 Best Practices

### State Management : Signals (Préféré)

Angular Signals est l'approche recommandée pour la gestion d'état réactive :

```typescript
import { Component, signal, computed, effect, inject } from '@angular/core';

@Component({...})
export class MyComponent {
  // ✅ Signal simple
  count = signal(0);
  
  // ✅ Signal dérivé (computed)
  doubleCount = computed(() => this.count() * 2);
  
  // ✅ Modifier un signal
  increment() {
    this.count.update(value => value + 1);
    // ou
    this.count.set(5);
  }
  
  // ✅ Effect pour side effects
  constructor() {
    effect(() => {
      console.log('Count changed:', this.count());
    });
  }
}
```

### Injection : `inject()` (Préféré)

Remplace le constructor injection par la fonction `inject()` :

```typescript
// ✅ Moderne - inject()
@Component({...})
export class MyComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);
}

// ❌ Ancien - Constructor
@Component({...})
export class MyComponent {
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
```

### New Control Flow

Utilise la nouvelle syntaxe de contrôle Angular 17+ :

```typescript
// ✅ @if au lieu de *ngIf
@if (user()) {
  <p>Welcome {{ user().name }}</p>
} @else {
  <p>Please login</p>
}

// ✅ @for au lieu de *ngFor
@for (item of items(); track item.id) {
  <li>{{ item.name }}</li>
} @empty {
  <li>No items found</li>
}

// ✅ @switch au lieu de *ngSwitch
@switch (status()) {
  @case ('loading') { <loading-spinner /> }
  @case ('success') { <success-message /> }
  @default { <error-message /> }
}
```

### Composants Standalone

Tous les composants sont standalone par défaut (pas de NgModules nécessaires) :

```typescript
@Component({
  selector: 'app-my-component',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `...`
})
export class MyComponent {}
```

### Quand utiliser NgRx ?

Signals sont suffisants pour la plupart des cas. Utilise NgRx si :
- ✅ Application très grande avec état complexe
- ✅ Besoin de devtools avancées (time-travel debugging)
- ✅ Équipe nombreuse avec besoin de patterns stricts
- ✅ Effets complexes avec orchestration

Pour 90% des projets, **Signals + Services** suffisent.

## Laravel 12 Best Practices

### Structure API
- Utiliser les Form Request pour validation
- Resource Controllers pour CRUD
- API Resources pour transformation JSON
- Policy/Authorization pour permissions

### Exemple :

```php
// routes/api.php
Route::apiResource('users', UserController::class);

// app/Http/Controllers/Api/UserController.php
class UserController extends Controller
{
    public function index()
    {
        return UserResource::collection(User::paginate());
    }
    
    public function store(StoreUserRequest $request)
    {
        $user = User::create($request->validated());
        return new UserResource($user);
    }
}
```

## Stack Complète

| Couche | Technologie | Version |
|--------|-------------|---------|
| Backend | Laravel | 12.x |
| Frontend | Angular | 19.x |
| Langage | PHP | 8.4 |
| Langage | TypeScript | 5.7 |
| CSS | Tailwind | 3.4 |
| State | Angular Signals | Native |

## Ressources

- [Angular.dev](https://angular.dev) - Documentation officielle
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Laravel 12 Docs](https://laravel.com/docs/12.x)
