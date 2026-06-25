<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; }
        h1 { font-size: 20px; margin-bottom: 5px; }
        .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .header p { font-size: 11px; color: #666; margin: 2px 0; }

        .summary-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .summary-table td { width: 16.66%; background: #f5f5f5; padding: 10px; text-align: center; border: 4px solid white; }
        .summary-table .label { font-size: 10px; color: #666; margin-bottom: 4px; }
        .summary-table .value { font-size: 18px; font-weight: bold; color: #222; }

        table.data { width: 100%; border-collapse: collapse; }
        table.data th { background: #333; color: white; padding: 8px; text-align: left; font-size: 10px; }
        table.data td { padding: 6px 8px; border-bottom: 1px solid #ddd; font-size: 11px; }
        .footer { margin-top: 20px; font-size: 10px; color: #999; text-align: center; }

        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-15deg);
            opacity: 0.08;
            z-index: -1;
            pointer-events: none;
        }
        .watermark img {
            width: 200px;
            height: auto;
        }
    </style>
</head>
<body>
    <div class="watermark">
        <img src="{{ public_path('images/logo.png') }}" alt="Cat House">
    </div>
    <div class="header">
        <h1>Laporan Reservasi</h1>
        <p>Periode: {{ $filters['from'] ?? 'Semua' }} - {{ $filters['to'] ?? 'Semua' }}</p>
        <p>Dicetak: {{ now()->format('d/m/Y H:i') }}</p>
    </div>

    <table class="summary-table" cellpadding="0" cellspacing="0">
        <tr>
            <td><div class="label">Total</div><div class="value">{{ $summary['total'] }}</div></td>
            <td><div class="label">Pending</div><div class="value">{{ $summary['pending'] }}</div></td>
            <td><div class="label">Konfirmasi</div><div class="value">{{ $summary['konfirmasi'] }}</div></td>
            <td><div class="label">Check-In</div><div class="value">{{ $summary['checkin'] }}</div></td>
            <td><div class="label">Check-Out</div><div class="value">{{ $summary['checkout'] }}</div></td>
            <td><div class="label">Batal</div><div class="value">{{ $summary['batal'] }}</div></td>
        </tr>
    </table>

    <table class="data">
        <thead>
            <tr>
                <th>Pelanggan</th>
                <th>Kucing</th>
                <th>Layanan</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Status</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @forelse($reservations as $res)
            <tr>
                <td>{{ $res->user?->name }}</td>
                <td>{{ $res->cat?->name }}</td>
                <td>{{ $res->service?->name }}</td>
                <td>{{ $res->check_in->format('d/m/Y') }}</td>
                <td>{{ $res->check_out->format('d/m/Y') }}</td>
                <td>{{ $res->status }}</td>
                <td>Rp {{ number_format($res->subtotal, 0, ',', '.') }}</td>
            </tr>
            @empty
            <tr><td colspan="7" style="text-align:center">Tidak ada data</td></tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">Cat House - Laporan Reservasi</div>
</body>
</html>
