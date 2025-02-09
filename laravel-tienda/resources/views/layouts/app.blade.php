<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Mi Tienda')</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
</head>
<body>
    <header>
        <h1>Mi Tienda</h1>
    </header>
    
    <main>
        @yield('content')
    </main>

    <footer>
        <p>&copy; {{ date('Y') }} Mi Tienda</p>
    </footer>
</body>
</html>
