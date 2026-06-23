<?php

return [
    'users' => [
        'name' => 'Users',
        'icon_key' => 'IconUsers',
        'permissions' => ['index', 'view', 'create', 'update', 'delete', 'toggle-active'],
    ],
    'services' => [
        'name' => 'Services',
        'icon_key' => 'IconToolsKitchen2',
        'permissions' => ['index', 'view', 'create', 'update', 'delete', 'toggle-active'],
    ],
    'cages' => [
        'name' => 'Cages',
        'icon_key' => 'IconHome',
        'permissions' => ['index', 'view', 'create', 'update', 'delete'],
    ],
    'permissions' => [
        'name' => 'Permissions',
        'icon_key' => 'IconShield',
        'permissions' => ['index', 'create', 'update', 'delete'],
    ],
    'roles' => [
        'name' => 'Roles',
        'icon_key' => 'IconLock',
        'permissions' => ['index', 'view', 'update'],
    ],
    'reservations' => [
        'name' => 'Reservations',
        'icon_key' => 'IconCalendarClock',
        'permissions' => ['index', 'view', 'update-status', 'delete'],
    ],
    'payments' => [
        'name' => 'Payments',
        'icon_key' => 'IconCreditCard',
        'permissions' => ['verify', 'reject'],
    ],
    'daily-reports' => [
        'name' => 'Daily Reports',
        'icon_key' => 'IconFileDescription',
        'permissions' => ['index', 'view', 'create', 'update'],
    ],
    'kategori-produk' => [
        'name' => 'Kategori Produk',
        'icon_key' => 'IconCategory',
        'permissions' => ['index', 'view', 'create', 'update', 'delete'],
    ],
    'produk' => [
        'name' => 'Produk',
        'icon_key' => 'IconPackage',
        'permissions' => ['index', 'view', 'create', 'update', 'delete'],
    ],
];
