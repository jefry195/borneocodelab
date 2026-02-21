<?php
header('Content-Type: application/json');

$dataFile = __DIR__ . '/data/portfolios.json';

// Initialize file if not exists
if (!file_exists($dataFile)) {
    if (!is_dir(dirname($dataFile))) {
        mkdir(dirname($dataFile), 0777, true);
    }
    file_put_contents($dataFile, json_encode([]));
}

$method = $_SERVER['REQUEST_METHOD'];

function getPortfolios() {
    global $dataFile;
    $data = file_get_contents($dataFile);
    return json_decode($data, true) ?: [];
}

function savePortfolios($portfolios) {
    global $dataFile;
    file_put_contents($dataFile, json_encode($portfolios, JSON_PRETTY_PRINT));
}

if ($method === 'GET') {
    echo json_encode(getPortfolios());
    exit;
}

// Authentication Check For Modifying Data
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized. Please login first.']);
    exit;
}

function handleImageUpload() {
    if (isset($_FILES['image_upload']) && $_FILES['image_upload']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/../assets/portfolios/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        
        $filename = time() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "", basename($_FILES['image_upload']['name']));
        $targetFile = $uploadDir . $filename;
        
        if (move_uploaded_file($_FILES['image_upload']['tmp_name'], $targetFile)) {
            return 'assets/portfolios/' . $filename;
        }
    }
    return null;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $isPut = isset($input['_method']) && strtoupper($input['_method']) === 'PUT';
    
    $portfolios = getPortfolios();
    $uploadedImagePath = handleImageUpload();
    
    if ($isPut) {
        $updated = false;
        foreach ($portfolios as &$portfolio) {
            if ($portfolio['id'] === $input['id']) {
                $portfolio['category'] = $input['category'] ?? $portfolio['category'];
                $portfolio['title'] = $input['title'] ?? $portfolio['title'];
                $portfolio['description'] = $input['description'] ?? $portfolio['description'];
                $portfolio['tags'] = $input['tags'] ?? $portfolio['tags'];
                $portfolio['portfolio_link'] = $input['portfolio_link'] ?? ($portfolio['portfolio_link'] ?? '');
                
                if ($uploadedImagePath) {
                    $portfolio['image'] = $uploadedImagePath;
                } else if (!empty($input['existing_image'])) {
                    $portfolio['image'] = $input['existing_image'];
                }
                
                $updated = true;
                break;
            }
        }
        
        if ($updated) {
            savePortfolios($portfolios);
            echo json_encode(['success' => true]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Not found']);
        }
        exit;
    } else {
        $imagePath = $uploadedImagePath ?: ($input['existing_image'] ?? 'https://picsum.photos/600/400');
        
        $newPortfolio = [
            'id' => uniqid(),
            'category' => $input['category'] ?? '',
            'title' => $input['title'] ?? '',
            'description' => $input['description'] ?? '',
            'tags' => $input['tags'] ?? '',
            'portfolio_link' => $input['portfolio_link'] ?? '',
            'image' => $imagePath
        ];
        
        array_push($portfolios, $newPortfolio);
        savePortfolios($portfolios);
        echo json_encode(['success' => true, 'data' => $newPortfolio]);
        exit;
    }
}

if ($method === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    // sometimes DELETE sends id via query param
    $id = $input['id'] ?? $_GET['id'] ?? null;
    
    $portfolios = getPortfolios();
    $initialCount = count($portfolios);
    $portfolios = array_filter($portfolios, function($p) use ($id) {
        return $p['id'] !== $id;
    });
    
    if (count($portfolios) < $initialCount) {
        // Reindex array so JSON encodes as array instead of object
        savePortfolios(array_values($portfolios));
        echo json_encode(['success' => true]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Not found']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
