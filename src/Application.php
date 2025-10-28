<?php

namespace App;

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

class Application
{
    private $twig;

    public function __construct()
    {
        // 1. Define the path to your Twig templates (relative to src/)
        $loader = new FilesystemLoader(__DIR__ . '/../templates');

        // 2. Initialize the Twig Environment
        $this->twig = new Environment($loader, [
            'debug' => true, // Essential for debugging!
        ]);

        // REQUIRED: Add Global variable for the Asset Base Path 
        // This is crucial because index.php is in the root, not public/.
        $this->twig->addGlobal('asset_base_path', '/public');
    }

    public function run()
    {
        // 1. Determine the requested route (e.g., '/', '/login', '/dashboard')
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        // Clean the URI and ensure a default route
        $route = trim($uri, '/');
        if (empty($route)) {
            $route = 'landing'; // Default to landing page
        }

        // 2. Simple Routing Logic
        $templateName = null; // Will hold the base name (e.g., 'landing')
        $context = ['current_user' => 'Guest', 'page_title' => ''];
        
        switch ($route) {
            case 'landing':
            case 'index.php': // Handle common entry point requests
                $templateName = 'landing';
                $context['page_title'] = 'Welcome';
                $context['content_block_title'] = 'Project Management for All Frameworks';
                break;
                
            case 'login':
                $templateName = 'login';
                $context['page_title'] = 'User Authentication';
                $context['content_block_title'] = 'Sign In to Your Account';
                break;
                
            case 'dashboard':
                $templateName = 'dashboard';
                $context['page_title'] = 'Dashboard';
                $context['content_block_title'] = 'Your Open Tickets';
                break;
                
            // ⭐ NEW: Add the Tickets page route to fix the 404 error ⭐
            case 'tickets':
                $templateName = 'tickets';
                $context['page_title'] = 'Ticket Management List';
                $context['content_block_title'] = 'Manage All Tickets';
                break;

            // Simple 404 handler
            default:
                http_response_code(404);
                $templateName = '404';
                $context['page_title'] = 'Page Not Found';
                $context['content_block_title'] = '404 Error';
        }

        // 3. Construct the full template path, PREPENDING 'pages/'
        $fullTemplatePath = 'pages/' . $templateName . '.html.twig'; 

        // 4. Render the correct template
        try {
            echo $this->twig->render($fullTemplatePath, $context);
        } catch (\Twig\Error\LoaderError $e) {
            // Error handling if template is missing
            // If this error still shows up for /tickets, it means your 
            // templates/pages/tickets.html.twig file path is wrong, 
            // OR the 404.html.twig is missing.
            echo "<h1>Template Error</h1><p>The template '$fullTemplatePath' could not be loaded.</p><p>Error: " . htmlspecialchars($e->getMessage()) . "</p>";
            error_log("Twig Loader Error: " . $e->getMessage());
        }
    }
}