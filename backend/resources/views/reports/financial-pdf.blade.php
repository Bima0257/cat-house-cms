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
        .summary-table td { width: 25%; background: #f5f5f5; padding: 10px; text-align: center; border: 4px solid white; }
        .summary-table .label { font-size: 10px; color: #666; margin-bottom: 4px; }
        .summary-table .value { font-size: 16px; font-weight: bold; color: #222; }

        table.data { width: 100%; border-collapse: collapse; }
        table.data th { background: #333; color: white; padding: 8px; text-align: left; font-size: 10px; }
        table.data td { padding: 6px 8px; border-bottom: 1px solid #ddd; font-size: 11px; }
        .footer { margin-top: 20px; font-size: 10px; color: #999; text-align: center; }
        .text-right { text-align: right; }

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
        <h1>Laporan Keuangan</h1>
        <p>Periode: {{ $filters['from'] ?? 'Semua' }} - {{ $filters['to'] ?? 'Semua' }}</p>
        <p>Dicetak: {{ now()->format('d/m/Y H:i') }}</p>
    </div>

    <table class="summary-table" cellpadding="0" cellspacing="0">
        <tr>
            <td><div class="label">Total Pendapatan</div><div class="value">Rp {{ number_format($summary['total_pendapatan'], 0, ',', '.') }}</div></td>
            <td><div class="label">Bulan Ini</div><div class="value">Rp {{ number_format($summary['pendapatan_bulan_ini'], 0, ',', '.') }}</div></td>
            <td><div class="label">Terverifikasi</div><div class="value">{{ $summary['terverifikasi'] }}</div></td>
            <td><div class="label">Pending</div><div class="value">{{ $summary['pending'] }}</div></td>
        </tr>
    </table>

    <table class="data">
        <thead>
            <tr>
                <th>Tanggal</th>
                <th>Pelanggan</th>
                <th>Reservasi</th>
                <th>Metode</th>
                <th class="text-right">Jumlah</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($payments as $p)
            <tr>
                <td>{{ $p->paid_at ? $p->paid_at->format('d/m/Y') : '-' }}</td>
                <td>{{ $p->reservation?->user?->name }}</td>
                <td>{{ $p->reservation?->cat?->name }}</td>
                <td>{{ $p->payment_method }}</td>
                <td class="text-right">Rp {{ number_format($p->amount, 0, ',', '.') }}</td>
                <td>{{ $p->status }}</td>
            </tr>
            @empty
            <tr><td colspan="6" style="text-align:center">Tidak ada data</td></tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">Cat House - Laporan Keuangan</div>
</body>
</html>
