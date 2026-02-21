<?php
// router.php - Untuk development server lokal (php -S)
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$docRoot = $_SERVER['DOCUMENT_ROOT'];

// Jika rute adalah /
if (empty($path) || $path === '/') {
    include $docRoot . '/index.html';
    return;
}

// Redirect ke URL bersih jika request akhir me-load .html atau .php (kecuali api.php atau router.php)
if (preg_match('/(\.html|\.php)$/', $path) && basename($path) !== 'api.php' && basename($path) !== 'router.php') {
    $cleanPath = preg_replace('/(\.html|\.php)$/', '', $path);
    header('Location: ' . $cleanPath, true, 301);
    exit;
}

// Tambahkan direktori default untuk /admin (agar tidak terjadi redirect berantakan)
if ($path === '/admin') {
    header('Location: /admin/', true, 301);
    exit;
}

// Redirect /login yang sering salah ketik menjadi /admin/login
if ($path === '/login' || $path === '/login/') {
    header('Location: /admin/login', true, 301);
    exit;
}

// Jika rute merupakan sebuah folder
if (is_dir($docRoot . $path)) {
    $dir = rtrim($docRoot . $path, '/');
    if (file_exists($dir . '/index.php')) {
        include $dir . '/index.php';
        return;
    }
    if (file_exists($dir . '/index.html')) {
        include $dir . '/index.html';
        return;
    }
}

// Jika request adalah path biasa (misal: /admin/login atau /privacy-policy), cari pasangannya:
if (empty(pathinfo($path, PATHINFO_EXTENSION))) {
    $fileHtml = $docRoot . $path . '.html';
    $filePhp = $docRoot . $path . '.php';

    if (file_exists($fileHtml)) {
        include $fileHtml;
        return;
    }
    
    if (file_exists($filePhp)) {
        include $filePhp;
        return;
    }
}

// Kembalikan false agar PHP server memproses request sebagai file statis biasa (js, css, dll)
return false;
?>
