<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro</title>
</head>
<body>
    <h2>Formulario de Registro</h2>
    <form action="{{ route('register.store') }}" method="POST">
        @csrf
        
        <div>
            <label for="name">Nombre:</label>
            <input type="text" id="name" name="name" required>
        </div>

        <div>
            <label for="lastName">Apellidos:</label>
            <input type="text" id="lastName" name="lastName" required>
        </div>

        <div>
            <label for="address">Dirección:</label>
            <input type="text" id="address" name="address" required>
        </div>

        <div>
            <label for="email">Correo electrónico:</label>
            <input type="email" id="email" name="email" required>
        </div>

        <div>
            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" required>
        </div>

        <div>
            <label for="confirmPassword">Repetir Contraseña:</label>
            <input type="password" id="confirmPassword" name="confirmPassword" required>
        </div>

        <button type="submit">Registrar</button>
    </form>
</body>
</html>
