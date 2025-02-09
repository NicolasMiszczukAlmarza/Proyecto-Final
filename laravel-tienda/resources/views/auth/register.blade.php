@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Registro de Usuario</h2>
    <form method="POST" action="{{ route('register.store') }}"> <!-- Cambio en la acción -->
        @csrf
        <label for="name">Nombre:</label>
        <input type="text" name="name" required>

        <label for="last_name">Apellido:</label>
        <input type="text" name="last_name" required>

        <label for="email">Correo Electrónico:</label>
        <input type="email" name="email" required>

        <label for="password">Contraseña:</label>
        <input type="password" name="password" required>

        <label for="password_confirmation">Confirmar Contraseña:</label>
        <input type="password" name="password_confirmation" required>

        <label for="address">Dirección:</label>
        <input type="text" name="address" required>

        <button type="submit">Registrarse</button>
    </form>
</div>
@endsection
