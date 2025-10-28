<?php

// 1. Load the Composer Autoloader (relative to root)
require __DIR__ . '/vendor/autoload.php';

// Import the Application class defined in src/Application.php
use App\Application;

// 2. Initialize and Run the Application
try {
    // Instantiate the application and run it
    $app = new Application();
    $app->run();
} catch (\Exception $e) {
    // REQUIRED: Flawless and descriptive error handling
    http_response_code(500);
    echo "<h1>Application Error</h1>";
    echo "<p>Something went wrong during the application boot or rendering process.</p>";
    echo "<p>Error: " . htmlspecialchars($e->getMessage()) . "</p>";
}