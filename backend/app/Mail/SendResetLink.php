<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendResetLink extends Mailable
{
    use Queueable, SerializesModels;

    public $resetLink;
    public $name;

    public function __construct($resetLink, $name)
    {
        $this->resetLink = $resetLink;
        $this->name = $name;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Atur Ulang Kata Sandi Cat House 🐱',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.SendResetLink',
            with: [
                'resetLink' => $this->resetLink,
                'name' => $this->name,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
