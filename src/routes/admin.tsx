import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { allNichesQuery, nicheBundleQuery } from "@/lib/niche-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Star, LogOut, ExternalLink, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { session, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  }
  if (!session) return <LoginScreen />;
  if (!isAdmin) return <NotAdminScreen />;
  return <Dashboard />;
}

function LoginScreen() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. You can now sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Auth error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-hero px-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader>
          <div className="mb-2 grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <CardTitle className="font-display">Admin {mode === "signin" ? "Sign In" : "Sign Up"}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to manage your portfolio."
              : "Create the admin account. Grant admin role from the database after first signup."}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete={mode === "signin" ? "current-password" : "new-password"} />
            </div>
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? "Working…" : mode === "signin" ? "Sign In" : "Create Account"}
            </Button>
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="block w-full text-center text-sm text-muted-foreground hover:text-foreground"
            >
              {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
            </button>
            <Link to="/" className="block text-center text-xs text-muted-foreground hover:underline">
              ← Back to site
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function NotAdminScreen() {
  const { user } = useAuth();
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <Card className="max-w-md text-center">
        <CardHeader>
          <CardTitle>Not an admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your account ({user?.email}) needs the admin role. Open the backend, find your user in the
            <code className="mx-1 rounded bg-muted px-1">user_roles</code> table, and add a row with role
            <code className="mx-1 rounded bg-muted px-1">admin</code>.
          </p>
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const { data: niches = [] } = useQuery(allNichesQuery());
  const [activeSlug, setActiveSlug] = useState<string>("email-marketer");

  useEffect(() => {
    if (niches.length && !niches.some((n) => n.slug === activeSlug)) {
      setActiveSlug(niches[0].slug);
    }
  }, [niches, activeSlug]);

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div>
            <div className="font-display text-lg font-bold">Admin Dashboard</div>
            <div className="text-xs text-muted-foreground">Manage all niches</div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={activeSlug} onValueChange={setActiveSlug}>
              <SelectTrigger className="w-[260px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {niches.map((n) => <SelectItem key={n.id} value={n.slug}>{n.display_name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => window.open(`/niche/${activeSlug}`, "_blank")}>
              <ExternalLink className="mr-1 h-3 w-3" /> Preview
            </Button>
            <Button variant="ghost" size="sm" onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }}>
              <LogOut className="mr-1 h-3 w-3" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
        <NicheEditor key={activeSlug} slug={activeSlug} />
      </main>
    </div>
  );
}

function NicheEditor({ slug }: { slug: string }) {
  const qc = useQueryClient();
  const { data: bundle, isLoading } = useQuery(nicheBundleQuery(slug));
  const limits = bundle?.limits ?? {};

  const refresh = () => qc.invalidateQueries({ queryKey: ["niche-bundle", slug] });

  if (isLoading || !bundle) {
    return <div className="text-muted-foreground">Loading niche…</div>;
  }

  return (
    <div className="space-y-8">
      <SettingsEditor bundle={bundle} onSaved={refresh} />
      <ThemeEditor bundle={bundle} onSaved={refresh} />
      <StoryEditor bundle={bundle} onSaved={refresh} />
      <StarSection title="Services" rows={bundle.services} table="services" limit={limits.services ?? 6} onChange={refresh} fields={["title", "description"]} />
      <StarSection title="Projects" rows={bundle.projects} table="projects" limit={limits.projects ?? 6} onChange={refresh} fields={["brand_name", "category"]} />
      <StarSection title="Testimonials" rows={bundle.testimonials} table="testimonials" limit={limits.testimonials ?? 6} onChange={refresh} fields={["client_name", "review_text"]} />
      <StarSection title="Brand Logos" rows={bundle.brandLogos} table="brand_logos" limit={limits.brand_logos ?? 8} onChange={refresh} fields={["alt_text"]} />
      {slug === "email-marketer" && (
        <StarSection title="Email Designs" rows={bundle.emailDesigns} table="email_designs" limit={limits.email_designs ?? 6} onChange={refresh} fields={["title", "client_name"]} />
      )}
      <Card>
        <CardHeader><CardTitle>Need to add new items?</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Add or remove projects, testimonials, services, certifications, and other content directly through the backend tables.
          Changes appear instantly on the live site.
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsEditor({ bundle, onSaved }: { bundle: any; onSaved: () => void }) {
  const [form, setForm] = useState(() => ({ ...(bundle.settings ?? {}) }));
  const [busy, setBusy] = useState(false);
  const fields = useMemo(() => ([
    ["full_name", "Full Name"], ["title", "Title"], ["hero_tagline", "Hero Tagline"],
    ["email", "Email"], ["phone", "Phone"], ["whatsapp", "WhatsApp"], ["location", "Location"],
    ["profile_picture_url", "Profile Picture URL"],
    ["hero_background_url", "Hero Background Image URL"],
  ] as const), []);

  async function save() {
    setBusy(true);
    try {
      const { error } = await supabase.from("niche_settings").update({
        full_name: form.full_name, title: form.title, hero_tagline: form.hero_tagline,
        bio: form.bio, email: form.email, phone: form.phone, whatsapp: form.whatsapp,
        location: form.location, profile_picture_url: form.profile_picture_url,
        projects_count: Number(form.projects_count) || 0,
        happy_clients: Number(form.happy_clients) || 0,
        years_experience: Number(form.years_experience) || 0,
        updated_at: new Date().toISOString(),
      }).eq("niche_id", bundle.niche.id);
      if (error) throw error;
      toast.success("Settings saved");
      onSaved();
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  }

  return (
    <Card>
      <CardHeader><CardTitle>Identity & Contact</CardTitle></CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {fields.map(([k, label]) => (
          <div key={k}>
            <Label>{label}</Label>
            <Input value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
          </div>
        ))}
        <div className="md:col-span-2">
          <Label>Bio</Label>
          <Textarea rows={4} value={form.bio ?? ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>
        <div><Label>Projects Count</Label><Input type="number" value={form.projects_count ?? 0} onChange={(e) => setForm({ ...form, projects_count: e.target.value })} /></div>
        <div><Label>Happy Clients</Label><Input type="number" value={form.happy_clients ?? 0} onChange={(e) => setForm({ ...form, happy_clients: e.target.value })} /></div>
        <div><Label>Years Experience</Label><Input type="number" value={form.years_experience ?? 0} onChange={(e) => setForm({ ...form, years_experience: e.target.value })} /></div>
        <div className="md:col-span-2"><Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save settings"}</Button></div>
      </CardContent>
    </Card>
  );
}

function ThemeEditor({ bundle, onSaved }: { bundle: any; onSaved: () => void }) {
  const [primary, setPrimary] = useState(bundle.settings?.primary_color ?? "#2563EB");
  const [secondary, setSecondary] = useState(bundle.settings?.secondary_color ?? "#0F172A");
  const [accent, setAccent] = useState(bundle.settings?.accent_color ?? "#F59E0B");
  const [animation, setAnimation] = useState(bundle.settings?.animation_enabled ?? true);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      const { error } = await supabase.from("niche_settings").update({
        primary_color: primary, secondary_color: secondary, accent_color: accent,
        animation_enabled: animation,
      }).eq("niche_id", bundle.niche.id);
      if (error) throw error;
      toast.success("Theme saved");
      onSaved();
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  }

  return (
    <Card>
      <CardHeader><CardTitle>Theme & Styling</CardTitle></CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-4">
        <ColorField label="Primary" value={primary} onChange={setPrimary} />
        <ColorField label="Secondary" value={secondary} onChange={setSecondary} />
        <ColorField label="Accent" value={accent} onChange={setAccent} />
        <div className="flex items-end gap-3">
          <div className="flex items-center gap-2">
            <Switch checked={animation} onCheckedChange={setAnimation} />
            <Label>Animations</Label>
          </div>
        </div>
        <div className="md:col-span-4"><Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save theme"}</Button></div>
      </CardContent>
    </Card>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-14 rounded-md border border-border" />
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}

function StoryEditor({ bundle, onSaved }: { bundle: any; onSaved: () => void }) {
  const [story, setStory] = useState(bundle.story?.story_text ?? "");
  const [quote, setQuote] = useState(bundle.story?.quote ?? "");
  const [imageUrl, setImageUrl] = useState(bundle.story?.image_url ?? "");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      const payload = { niche_id: bundle.niche.id, story_text: story, quote, image_url: imageUrl };
      const { error } = bundle.story
        ? await supabase.from("niche_stories").update(payload).eq("niche_id", bundle.niche.id)
        : await supabase.from("niche_stories").insert(payload);
      if (error) throw error;
      toast.success("Story saved");
      onSaved();
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  }

  return (
    <Card>
      <CardHeader><CardTitle>My Story</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div><Label>Story</Label><Textarea rows={4} value={story} onChange={(e) => setStory(e.target.value)} /></div>
        <div><Label>Quote</Label><Input value={quote} onChange={(e) => setQuote(e.target.value)} /></div>
        <div><Label>Image URL</Label><Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} /></div>
        <Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save story"}</Button>
      </CardContent>
    </Card>
  );
}

function StarSection({
  title, rows, table, limit, onChange, fields,
}: {
  title: string; rows: any[]; table: string; limit: number; onChange: () => void; fields: string[];
}) {
  const starredCount = rows.filter((r) => r.is_starred).length;
  async function toggleStar(row: any) {
    if (!row.is_starred && starredCount >= limit) {
      toast.error(`Homepage can only show ${limit} ${title.toLowerCase()}. Remove a star first.`);
      return;
    }
    const { error } = await supabase.from(table as any).update({ is_starred: !row.is_starred }).eq("id", row.id);
    if (error) toast.error(error.message);
    else onChange();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <span className="text-xs font-normal text-muted-foreground">
            Homepage limit: {starredCount} / {limit}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">None yet. Add some via the backend.</p>
        ) : (
          <div className="divide-y divide-border">
            {rows.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0 flex-1">
                  {fields.map((f) => (
                    <div key={f} className={f === fields[0] ? "font-medium truncate" : "text-sm text-muted-foreground line-clamp-1"}>
                      {r[f]}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => toggleStar(r)}
                  className={`grid h-9 w-9 place-items-center rounded-full border transition-smooth ${r.is_starred ? "border-[color:var(--brand-accent-hex)] bg-[color:var(--brand-accent-hex)]/10 text-[color:var(--brand-accent-hex)]" : "border-border text-muted-foreground hover:text-foreground"}`}
                  aria-label={r.is_starred ? "Unstar" : "Star"}
                >
                  <Star className={`h-4 w-4 ${r.is_starred ? "fill-current" : ""}`} />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
