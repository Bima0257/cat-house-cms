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
        .summary-table td { width: 33.33%; background: #f5f5f5; padding: 10px; text-align: center; border: 4px solid white; }
        .summary-table .label { font-size: 10px; color: #666; margin-bottom: 4px; }
        .summary-table .value { font-size: 18px; font-weight: bold; color: #222; }

        .breed-section { margin-bottom: 20px; }
        .breed-section h3 { font-size: 14px; margin-bottom: 8px; color: #333; }
        .breed-item { display: inline-block; background: #f0f0f0; padding: 4px 10px; border-radius: 12px; margin: 2px; font-size: 11px; }

        table.data { width: 100%; border-collapse: collapse; }
        table.data th { background: #333; color: white; padding: 8px; text-align: left; font-size: 10px; }
        table.data td { padding: 6px 8px; border-bottom: 1px solid #ddd; font-size: 11px; }
        .footer { margin-top: 20px; font-size: 10px; color: #999; text-align: center; }

        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-15deg);
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
        <h1>Laporan Kucing</h1>
        <p>Periode: {{ $filters['from'] ?? 'Semua' }} - {{ $filters['to'] ?? 'Semua' }}</p>
        <p>Dicetak: {{ now()->format('d/m/Y H:i') }}</p>
    </div>

    <table class="summary-table" cellpadding="0" cellspacing="0">
        <tr>
            <td><div class="label">Total Kucing</div><div class="value">{{ $summary['total_kucing'] }}</div></td>
            <td><div class="label">Sedang Dititipkan</div><div class="value">{{ $summary['sedang_dititipkan'] }}</div></td>
            <td><div class="label">Pernah Dititipkan</div><div class="value">{{ $summary['pernah_dititipkan'] }}</div></td>
        </tr>
    </table>

    @if(!empty($summary['ras_terbanyak']) && count($summary['ras_terbanyak']) > 0)
    <div class="breed-section">
        <h3>Ras Terbanyak</h3>
        @foreach($summary['ras_terbanyak'] as $breed => $total)
            <span class="breed-item">{{ $breed ?: 'Tidak diketahui' }} ({{ $total }})</span>
        @endforeach
    </div>
    @endif

    <table class="data">
        <thead>
            <tr>
                <th>Nama</th>
                <th>Pemilik</th>
                <th>Ras</th>
                <th>JK</th>
                <th>Total Reservasi</th>
            </tr>
        </thead>
        <tbody>
            @forelse($cats as $cat)
            <tr>
                <td>{{ $cat->name }}</td>
                <td>{{ $cat->owner?->name }}</td>
                <td>{{ $cat->breed ?: '-' }}</td>
                <td>{{ $cat->gender ?: '-' }}</td>
                <td>{{ $cat->reservations_count }}x</td>
            </tr>
            @empty
            <tr><td colspan="5" style="text-align:center">Tidak ada data</td></tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">Cat House - Laporan Kucing</div>
</body>
</html>
