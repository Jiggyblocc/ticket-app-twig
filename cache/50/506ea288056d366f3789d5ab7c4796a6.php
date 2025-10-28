<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\CoreExtension;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;
use Twig\TemplateWrapper;

/* pages/landing.html.twig */
class __TwigTemplate_605bb8bd867bc727f1a5369c741c0e1d extends Template
{
    private Source $source;
    /**
     * @var array<string, Template>
     */
    private array $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = []): iterable
    {
        $macros = $this->macros;
        // line 1
        yield "{% extends \"base.html.twig\" %}";
        yield "

";
        // line 3
        yield "{% block content %}";
        yield "
    ";
        // line 5
        yield "    <section class=\"hero-section landing-hero\">
        ";
        // line 7
        yield "        <div class=\"wavy-background\"></div>
        <div class=\"decorative-circle circle-one\"></div>
        <div class=\"decorative-circle circle-two\"></div>
        <div class=\"decorative-circle circle-three\"></div>

        <div class=\"hero-content max-width-1440\">
            <h1>Manage Your Tickets, Simplified.</h1>
            <p>React, Vue, and Twig, all with one consistent design.</p>
            <div class=\"hero-actions\">
                <a href=\"/login\" class=\"button primary-button\">Get Started</a>
                <a href=\"/about\" class=\"button secondary-button\">Learn More</a>
            </div>
        </div>
    </section>

    ";
        // line 23
        yield "    <section class=\"features-section max-width-1440\">
        <div class=\"box-shaped-section\">
            <h2>Cross-Framework Consistency</h2>
            <p>A uniform design system for a seamless experience across all versions of the application.</p>
        </div>
        <div class=\"box-shaped-section\">
            <h2>Robust Ticket Management</h2>
            <p>Full CRUD operations with strict data validation for ticket titles and status.</p>
        </div>
        <div class=\"box-shaped-section\">
            <h2>Accessibility First</h2>
            <p>Designed and built with accessibility standards as a core requirement.</p>
        </div>
    </section>

";
        // line 38
        yield "{% endblock %}";
        yield from [];
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName(): string
    {
        return "pages/landing.html.twig";
    }

    /**
     * @codeCoverageIgnore
     */
    public function getDebugInfo(): array
    {
        return array (  88 => 38,  71 => 23,  54 => 7,  51 => 5,  47 => 3,  42 => 1,);
    }

    public function getSourceContext(): Source
    {
        return new Source("", "pages/landing.html.twig", "/Users/user/Documents/ticket-app-twig/templates/pages/landing.html.twig");
    }
}
