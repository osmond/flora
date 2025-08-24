/app
└── page.tsx # Root dashboard
└── today/page.tsx # Today's tasks
└── plants/[id]/page.tsx # Plant detail
└── add/page.tsx # Add plant flow


/components
└── plant/ # Plant-specific UI
└── layout/ # Header, nav, etc
└── ui/ # Shared primitives (Card, Button, etc)


/lib
└── supabase/ # Supabase helpers
└── utils.ts # Shared utils


/public # App assets (logo, favicon, etc)
/styles # Tailwind + global CSS