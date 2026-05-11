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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Star, LogOut, ExternalLink, ShieldCheck, Plus, Pencil, Trash2, Settings2,
  User, Palette, BookOpen, Sliders, Share2, Award, Briefcase, FolderKanban,
  MessageSquareQuote, Image as ImageIcon, Mail, Sparkles, Layers, Menu,
} from "lucide-react";
import { FileField } from "@/components/admin/FileField";
import { cn } from "@/lib/utils";

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
          email, password,
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
        <CardHeader><CardTitle>Not an admin</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your account ({user?.email}) needs the admin role.
          </p>
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
        </CardContent>
      </Card>
    </div>
  );
}

type SectionId =
  | "overview" | "meta" | "identity" | "theme" | "story" | "limits"
  | "social" | "skills" | "certifications" | "services" | "projects"
  | "testimonials" | "logos" | "email_designs";

const SECTIONS: { id: SectionId; label: string; icon: any; emailOnly?: boolean }[] = [
  { id: "overview", label: "Overview", icon: Layers },
  { id: "meta", label: "Niche metadata", icon: Settings2 },
  { id: "identity", label: "Identity & Contact", icon: User },
  { id: "theme", label: "Theme & Styling", icon: Palette },
  { id: "story", label: "My Story", icon: BookOpen },
  { id: "limits", label: "Homepage limits", icon: Sliders },
  { id: "social", label: "Social links", icon: Share2 },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "services", label: "Services", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { id: "logos", label: "Brand logos", icon: ImageIcon },
  { id: "email_designs", label: "Email designs", icon: Mail, emailOnly: true },
];

function Dashboard() {
  const navigate = useNavigate();
  const { data: niches = [] } = useQuery(allNichesQuery());
  const [activeSlug, setActiveSlug] = useState<string>("email-marketer");
  const [section, setSection] = useState<SectionId>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (niches.length && !niches.some((n) => n.slug === activeSlug)) {
      setActiveSlug(niches[0].slug);
    }
  }, [niches, activeSlug]);

  const visibleSections = SECTIONS.filter((s) => !s.emailOnly || activeSlug === "email-marketer");

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileNavOpen((v) => !v)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <div className="font-display text-lg font-bold leading-tight">Admin Dashboard</div>
              <div className="text-xs text-muted-foreground">Full management for every niche</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={activeSlug} onValueChange={(v) => { setActiveSlug(v); setSection("overview"); }}>
              <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
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

      <div className="flex">
        <aside
          className={cn(
            "w-64 shrink-0 border-r border-border bg-background",
            "lg:sticky lg:top-[65px] lg:block lg:h-[calc(100vh-65px)] lg:overflow-y-auto",
            mobileNavOpen ? "fixed inset-y-0 left-0 top-[65px] z-40 block overflow-y-auto" : "hidden",
          )}
        >
          <nav className="space-y-1 p-3">
            <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sections</div>
            {visibleSections.map((s) => {
              const Icon = s.icon;
              const active = section === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => { setSection(s.id); setMobileNavOpen(false); }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-primary text-primary-foreground font-medium shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{s.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-6">
            <NicheEditor
              key={activeSlug + section}
              slug={activeSlug}
              section={section}
              onDeleted={() => { setActiveSlug(niches[0]?.slug ?? ""); setSection("overview"); }}
              onSwitchSection={setSection}
              onSwitchNiche={setActiveSlug}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function NicheEditor({
  slug, section, onDeleted, onSwitchSection, onSwitchNiche,
}: {
  slug: string;
  section: SectionId;
  onDeleted: () => void;
  onSwitchSection: (s: SectionId) => void;
  onSwitchNiche: (slug: string) => void;
}) {
  const qc = useQueryClient();
  const { data: bundle, isLoading } = useQuery(nicheBundleQuery(slug));
  const limits = bundle?.limits ?? {};
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["niche-bundle", slug] });
    qc.invalidateQueries({ queryKey: ["niches"] });
  };

  if (isLoading || !bundle) return <div className="text-muted-foreground">Loading niche…</div>;
  const nicheId = bundle.niche.id;

  switch (section) {
    case "overview":
      return <OverviewPanel bundle={bundle} onSwitchSection={onSwitchSection} onCreated={onSwitchNiche} />;
    case "meta":
      return <NicheMetaEditor niche={bundle.niche} onSaved={refresh} onDeleted={() => { onDeleted(); refresh(); }} />;
    case "identity":
      return <SettingsEditor bundle={bundle} onSaved={refresh} />;
    case "theme":
      return <ThemeEditor bundle={bundle} onSaved={refresh} />;
    case "story":
      return <StoryEditor bundle={bundle} onSaved={refresh} />;
    case "limits":
      return <LimitsEditor bundle={bundle} onSaved={refresh} />;
    case "social":
      return <SocialLinksSection nicheId={nicheId} rows={bundle.socialLinks} onChange={refresh} />;
    case "skills":
      return <SkillsSection nicheId={nicheId} rows={bundle.skills} onChange={refresh} />;
    case "certifications":
      return <CertificationsSection nicheId={nicheId} rows={bundle.certifications} onChange={refresh} />;
    case "services":
      return <ServicesSection nicheId={nicheId} rows={bundle.services} limit={limits.services ?? 6} onChange={refresh} />;
    case "projects":
      return <ProjectsSection nicheId={nicheId} rows={bundle.projects} limit={limits.projects ?? 6} onChange={refresh} />;
    case "testimonials":
      return <TestimonialsSection nicheId={nicheId} rows={bundle.testimonials} limit={limits.testimonials ?? 6} onChange={refresh} />;
    case "logos":
      return <BrandLogosSection nicheId={nicheId} rows={bundle.brandLogos} limit={limits.brand_logos ?? 8} onChange={refresh} />;
    case "email_designs":
      return <EmailDesignsSection nicheId={nicheId} rows={bundle.emailDesigns} limit={limits.email_designs ?? 6} onChange={refresh} />;
    default:
      return null;
  }
}

function OverviewPanel({
  bundle, onSwitchSection, onCreated,
}: { bundle: any; onSwitchSection: (s: SectionId) => void; onCreated: (slug: string) => void }) {
  const stats = [
    { label: "Services", count: bundle.services.length, section: "services" as SectionId },
    { label: "Projects", count: bundle.projects.length, section: "projects" as SectionId },
    { label: "Testimonials", count: bundle.testimonials.length, section: "testimonials" as SectionId },
    { label: "Brand logos", count: bundle.brandLogos.length, section: "logos" as SectionId },
    { label: "Skills", count: bundle.skills.length, section: "skills" as SectionId },
    { label: "Certifications", count: bundle.certifications.length, section: "certifications" as SectionId },
    { label: "Social links", count: bundle.socialLinks.length, section: "social" as SectionId },
  ];
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-4 w-4" /> {bundle.niche.display_name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Pick a section from the sidebar to manage that part of this niche. All media fields support direct upload from your device.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <button
            key={s.section}
            onClick={() => onSwitchSection(s.section)}
            className="rounded-lg border border-border bg-card p-4 text-left transition-smooth hover:border-primary hover:shadow-sm"
          >
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="mt-1 font-display text-2xl font-bold">{s.count}</div>
          </button>
        ))}
      </div>

      <NewNicheCard onCreated={onCreated} />
    </div>
  );
}

/* ------------------------- META / SETTINGS / THEME / STORY ------------------------- */

function NicheMetaEditor({ niche, onSaved, onDeleted }: { niche: any; onSaved: () => void; onDeleted: () => void }) {
  const [displayName, setDisplayName] = useState(niche.display_name);
  const [slug, setSlug] = useState(niche.slug);
  const [sortOrder, setSortOrder] = useState<number>(niche.sort_order ?? 0);
  const [isActive, setIsActive] = useState<boolean>(niche.is_active);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      const { error } = await supabase.from("niches").update({
        display_name: displayName, slug: toSlug(slug), sort_order: Number(sortOrder) || 0, is_active: isActive,
      }).eq("id", niche.id);
      if (error) throw error;
      toast.success("Niche updated");
      onSaved();
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  }

  async function destroy() {
    setBusy(true);
    try {
      // Cascade delete dependents (no FKs configured)
      const tables = [
        "niche_settings", "niche_stories", "services", "skills", "projects",
        "certifications", "testimonials", "brand_logos", "social_links",
        "niche_homepage_limits", "email_designs",
      ];
      for (const t of tables) {
        await supabase.from(t as any).delete().eq("niche_id", niche.id);
      }
      const { error } = await supabase.from("niches").delete().eq("id", niche.id);
      if (error) throw error;
      toast.success("Niche deleted");
      onDeleted();
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2"><Settings2 className="h-4 w-4" /> Niche metadata</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm"><Trash2 className="mr-1 h-3 w-3" /> Delete niche</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this niche?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently removes the niche and all its content (services, projects, testimonials, etc.).
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={destroy}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div><Label>Display name</Label><Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} /></div>
        <div><Label>URL slug</Label><Input value={slug} onChange={(e) => setSlug(e.target.value)} /></div>
        <div><Label>Sort order</Label><Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} /></div>
        <div className="flex items-end gap-3"><Switch checked={isActive} onCheckedChange={setIsActive} /><Label>Active (visible on site)</Label></div>
        <div className="md:col-span-2"><Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save niche"}</Button></div>
      </CardContent>
    </Card>
  );
}

function SettingsEditor({ bundle, onSaved }: { bundle: any; onSaved: () => void }) {
  const [form, setForm] = useState(() => ({ ...(bundle.settings ?? { niche_id: bundle.niche.id }) }));
  const [busy, setBusy] = useState(false);
  const fields = useMemo(() => ([
    ["full_name", "Full Name"], ["title", "Title"], ["hero_tagline", "Hero Tagline"],
    ["email", "Email"], ["phone", "Phone"], ["whatsapp", "WhatsApp"], ["location", "Location"],
  ] as const), []);

  async function persist(next: any, opts?: { silent?: boolean }) {
    const payload = {
      niche_id: bundle.niche.id,
      full_name: next.full_name, title: next.title, hero_tagline: next.hero_tagline,
      bio: next.bio, email: next.email, phone: next.phone, whatsapp: next.whatsapp,
      location: next.location, profile_picture_url: next.profile_picture_url,
      hero_background_url: next.hero_background_url,
      projects_count: Number(next.projects_count) || 0,
      happy_clients: Number(next.happy_clients) || 0,
      years_experience: Number(next.years_experience) || 0,
      updated_at: new Date().toISOString(),
    };
    const { error } = bundle.settings
      ? await supabase.from("niche_settings").update(payload).eq("niche_id", bundle.niche.id)
      : await supabase.from("niche_settings").insert(payload);
    if (error) throw error;
    if (!opts?.silent) toast.success("Settings saved");
    onSaved();
  }

  async function save() {
    setBusy(true);
    try { await persist(form); }
    catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  }

  async function handlePersistField(field: "profile_picture_url" | "hero_background_url", url: string) {
    const next = { ...form, [field]: url };
    setForm(next);
    try {
      await persist(next, { silent: true });
      toast.success(url ? "Image saved to homepage" : "Image removed");
    } catch (e: any) {
      toast.error(`Saved upload but failed to update settings: ${e.message}`);
    }
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
        <div className="md:col-span-2">
          <FileField label="Profile picture" value={form.profile_picture_url ?? ""} onChange={(v) => setForm({ ...form, profile_picture_url: v })} onPersist={(v) => handlePersistField("profile_picture_url", v)} folder="profiles" accept="image/*" helperText="Auto-saves to your homepage on upload." />
        </div>
        <div className="md:col-span-2">
          <FileField label="Hero background image" value={form.hero_background_url ?? ""} onChange={(v) => setForm({ ...form, hero_background_url: v })} onPersist={(v) => handlePersistField("hero_background_url", v)} folder="hero" accept="image/*" helperText="Auto-saves to your homepage on upload." />
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
  const [fontFamily, setFontFamily] = useState(bundle.settings?.font_family ?? "Inter");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      const { error } = await supabase.from("niche_settings").update({
        primary_color: primary, secondary_color: secondary, accent_color: accent,
        animation_enabled: animation, font_family: fontFamily,
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
        <div><Label>Font family</Label><Input value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} /></div>
        <div className="flex items-end gap-3 md:col-span-4">
          <Switch checked={animation} onCheckedChange={setAnimation} /><Label>Animations</Label>
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
        <FileField label="Story image" value={imageUrl} onChange={setImageUrl} folder="story" accept="image/*" />
        <Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save story"}</Button>
      </CardContent>
    </Card>
  );
}

function LimitsEditor({ bundle, onSaved }: { bundle: any; onSaved: () => void }) {
  const sections = ["services", "projects", "testimonials", "brand_logos", "email_designs"];
  const [vals, setVals] = useState<Record<string, number>>(() => {
    const m: Record<string, number> = {};
    sections.forEach((s) => { m[s] = bundle.limits[s] ?? 6; });
    return m;
  });
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      for (const s of sections) {
        const { data: existing } = await supabase
          .from("niche_homepage_limits").select("id").eq("niche_id", bundle.niche.id).eq("section_name", s).maybeSingle();
        if (existing) {
          await supabase.from("niche_homepage_limits").update({ max_display: vals[s] }).eq("id", existing.id);
        } else {
          await supabase.from("niche_homepage_limits").insert({ niche_id: bundle.niche.id, section_name: s, max_display: vals[s] });
        }
      }
      toast.success("Limits saved");
      onSaved();
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  }

  return (
    <Card>
      <CardHeader><CardTitle>Homepage display limits</CardTitle></CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-5">
        {sections.map((s) => (
          <div key={s}>
            <Label className="capitalize">{s.replace("_", " ")}</Label>
            <Input type="number" min={0} value={vals[s]} onChange={(e) => setVals({ ...vals, [s]: Number(e.target.value) })} />
          </div>
        ))}
        <div className="md:col-span-5"><Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save limits"}</Button></div>
      </CardContent>
    </Card>
  );
}

/* ------------------------- GENERIC CRUD SHELL ------------------------- */

type CrudShellProps = {
  title: string;
  rows: any[];
  table: string;
  limit?: number;
  onChange: () => void;
  starrable?: boolean;
  renderRow: (row: any) => React.ReactNode;
  renderForm: (
    state: any,
    setState: (s: any) => void
  ) => React.ReactNode;
  emptyState?: () => any;
  validate?: (state: any) => string | null;
};

function CrudShell({
  title, rows, table, limit, onChange, starrable, renderRow, renderForm, emptyState, validate,
}: CrudShellProps) {
  const [openNew, setOpenNew] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const starredCount = starrable ? rows.filter((r) => r.is_starred).length : 0;

  async function toggleStar(row: any) {
    if (limit && !row.is_starred && starredCount >= limit) {
      toast.error(`Homepage can only show ${limit}. Remove a star first.`);
      return;
    }
    const { error } = await supabase.from(table as any).update({ is_starred: !row.is_starred }).eq("id", row.id);
    if (error) toast.error(error.message); else onChange();
  }

  async function remove(row: any) {
    const { error } = await supabase.from(table as any).delete().eq("id", row.id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); onChange(); }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <div className="flex items-center gap-3">
            {starrable && limit !== undefined && (
              <span className="text-xs font-normal text-muted-foreground">Homepage: {starredCount} / {limit}</span>
            )}
            <Dialog open={openNew} onOpenChange={setOpenNew}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline"><Plus className="mr-1 h-3 w-3" /> Add</Button>
              </DialogTrigger>
              <ItemDialog
                title={`New ${title.replace(/s$/, "").toLowerCase()}`}
                table={table}
                initial={emptyState ? emptyState() : {}}
                renderForm={renderForm}
                validate={validate}
                onClose={() => setOpenNew(false)}
                onSaved={() => { setOpenNew(false); onChange(); }}
              />
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No items yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {rows.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0 flex-1">{renderRow(r)}</div>
                <div className="flex items-center gap-1">
                  {starrable && (
                    <button
                      onClick={() => toggleStar(r)}
                      className={`grid h-9 w-9 place-items-center rounded-full border transition-smooth ${r.is_starred ? "border-[color:var(--brand-accent-hex)] bg-[color:var(--brand-accent-hex)]/10 text-[color:var(--brand-accent-hex)]" : "border-border text-muted-foreground hover:text-foreground"}`}
                      aria-label={r.is_starred ? "Unstar" : "Star"}
                    >
                      <Star className={`h-4 w-4 ${r.is_starred ? "fill-current" : ""}`} />
                    </button>
                  )}
                  <Dialog open={editing?.id === r.id} onOpenChange={(o) => setEditing(o ? r : null)}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                    </DialogTrigger>
                    {editing?.id === r.id && (
                      <ItemDialog
                        title={`Edit ${title.replace(/s$/, "").toLowerCase()}`}
                        table={table}
                        initial={editing}
                        renderForm={renderForm}
                        validate={validate}
                        onClose={() => setEditing(null)}
                        onSaved={() => { setEditing(null); onChange(); }}
                      />
                    )}
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this item?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove(r)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ItemDialog({
  title, table, initial, renderForm, validate, onClose, onSaved,
}: {
  title: string; table: string; initial: any;
  renderForm: (s: any, setS: (s: any) => void) => React.ReactNode;
  validate?: (s: any) => string | null;
  onClose: () => void; onSaved: () => void;
}) {
  const [state, setState] = useState<any>({ ...initial });
  const [busy, setBusy] = useState(false);
  const isEdit = !!initial.id;

  async function save() {
    const err = validate?.(state);
    if (err) { toast.error(err); return; }
    setBusy(true);
    try {
      const { id, ...payload } = state;
      if (isEdit) {
        const { error } = await supabase.from(table as any).update(payload).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table as any).insert(payload);
        if (error) throw error;
      }
      toast.success(isEdit ? "Updated" : "Created");
      onSaved();
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  }

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
      <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
      <div className="space-y-4 py-2">{renderForm(state, setState)}</div>
      <DialogFooter>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
      </DialogFooter>
    </DialogContent>
  );
}

/* ------------------------- PER-TABLE SECTIONS ------------------------- */

function ServicesSection({ nicheId, rows, limit, onChange }: any) {
  return (
    <CrudShell
      title="Services" table="services" rows={rows} limit={limit} onChange={onChange} starrable
      emptyState={() => ({ niche_id: nicheId, title: "", description: "", icon: "", sort_order: 0, is_starred: false })}
      validate={(s) => (!s.title ? "Title is required" : null)}
      renderRow={(r) => (
        <>
          <div className="font-medium truncate">{r.title}</div>
          <div className="text-sm text-muted-foreground line-clamp-1">{r.description}</div>
        </>
      )}
      renderForm={(s, set) => (
        <>
          <div><Label>Title *</Label><Input value={s.title ?? ""} onChange={(e) => set({ ...s, title: e.target.value })} /></div>
          <div><Label>Description</Label><Textarea rows={3} value={s.description ?? ""} onChange={(e) => set({ ...s, description: e.target.value })} /></div>
          <div><Label>Icon (lucide name or emoji)</Label><Input value={s.icon ?? ""} onChange={(e) => set({ ...s, icon: e.target.value })} /></div>
          <div><Label>Sort order</Label><Input type="number" value={s.sort_order ?? 0} onChange={(e) => set({ ...s, sort_order: Number(e.target.value) })} /></div>
        </>
      )}
    />
  );
}

function ProjectsSection({ nicheId, rows, limit, onChange }: any) {
  return (
    <CrudShell
      title="Projects" table="projects" rows={rows} limit={limit} onChange={onChange} starrable
      emptyState={() => ({ niche_id: nicheId, brand_name: "", category: "", description: "", platform: "", figma_link: "", external_link: "", media_url: "", media_type: "image", sort_order: 0, is_starred: false })}
      validate={(s) => (!s.brand_name ? "Brand name is required" : null)}
      renderRow={(r) => (
        <>
          <div className="font-medium truncate">{r.brand_name}</div>
          <div className="text-sm text-muted-foreground line-clamp-1">{r.category} {r.platform ? `• ${r.platform}` : ""}</div>
        </>
      )}
      renderForm={(s, set) => (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            <div><Label>Brand name *</Label><Input value={s.brand_name ?? ""} onChange={(e) => set({ ...s, brand_name: e.target.value })} /></div>
            <div><Label>Category</Label><Input value={s.category ?? ""} onChange={(e) => set({ ...s, category: e.target.value })} /></div>
            <div><Label>Platform</Label><Input value={s.platform ?? ""} onChange={(e) => set({ ...s, platform: e.target.value })} /></div>
            <div>
              <Label>Media type</Label>
              <Select value={s.media_type ?? "image"} onValueChange={(v) => set({ ...s, media_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div><Label>Description</Label><Textarea rows={3} value={s.description ?? ""} onChange={(e) => set({ ...s, description: e.target.value })} /></div>
          <FileField
            label="Project media"
            value={s.media_url ?? ""}
            onChange={(v) => set({ ...s, media_url: v })}
            folder="projects"
            accept={s.media_type === "video" ? "video/*" : "image/*"}
            preview={s.media_type === "video" ? "video" : "image"}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <div><Label>Figma link</Label><Input value={s.figma_link ?? ""} onChange={(e) => set({ ...s, figma_link: e.target.value })} /></div>
            <div><Label>External link</Label><Input value={s.external_link ?? ""} onChange={(e) => set({ ...s, external_link: e.target.value })} /></div>
          </div>
          <div><Label>Sort order</Label><Input type="number" value={s.sort_order ?? 0} onChange={(e) => set({ ...s, sort_order: Number(e.target.value) })} /></div>
        </>
      )}
    />
  );
}

function TestimonialsSection({ nicheId, rows, limit, onChange }: any) {
  return (
    <CrudShell
      title="Testimonials" table="testimonials" rows={rows} limit={limit} onChange={onChange} starrable
      emptyState={() => ({ niche_id: nicheId, client_name: "", role: "", photo_url: "", review_text: "", rating: 5, sort_order: 0, is_starred: false })}
      validate={(s) => (!s.client_name ? "Client name required" : !s.review_text ? "Review text required" : null)}
      renderRow={(r) => (
        <>
          <div className="font-medium truncate">{r.client_name} <span className="text-xs text-muted-foreground">★ {r.rating}</span></div>
          <div className="text-sm text-muted-foreground line-clamp-1">{r.review_text}</div>
        </>
      )}
      renderForm={(s, set) => (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            <div><Label>Client name *</Label><Input value={s.client_name ?? ""} onChange={(e) => set({ ...s, client_name: e.target.value })} /></div>
            <div><Label>Role / company</Label><Input value={s.role ?? ""} onChange={(e) => set({ ...s, role: e.target.value })} /></div>
          </div>
          <FileField label="Client photo" value={s.photo_url ?? ""} onChange={(v) => set({ ...s, photo_url: v })} folder="testimonials" accept="image/*" />
          <div><Label>Review text *</Label><Textarea rows={4} value={s.review_text ?? ""} onChange={(e) => set({ ...s, review_text: e.target.value })} /></div>
          <div className="grid gap-3 md:grid-cols-2">
            <div><Label>Rating (1-5)</Label><Input type="number" min={1} max={5} value={s.rating ?? 5} onChange={(e) => set({ ...s, rating: Number(e.target.value) })} /></div>
            <div><Label>Sort order</Label><Input type="number" value={s.sort_order ?? 0} onChange={(e) => set({ ...s, sort_order: Number(e.target.value) })} /></div>
          </div>
        </>
      )}
    />
  );
}

function BrandLogosSection({ nicheId, rows, limit, onChange }: any) {
  return (
    <CrudShell
      title="Brand logos" table="brand_logos" rows={rows} limit={limit} onChange={onChange} starrable
      emptyState={() => ({ niche_id: nicheId, logo_url: "", alt_text: "", bg_color: "#FFFFFF", sort_order: 0, is_starred: false })}
      validate={(s) => (!s.logo_url ? "Logo image required" : null)}
      renderRow={(r) => (
        <div className="flex items-center gap-3">
          {r.logo_url && <img src={r.logo_url} alt={r.alt_text} className="h-8 w-8 rounded object-contain" style={{ background: r.bg_color }} />}
          <div className="font-medium truncate">{r.alt_text || "Untitled logo"}</div>
        </div>
      )}
      renderForm={(s, set) => (
        <>
          <FileField label="Logo image *" value={s.logo_url ?? ""} onChange={(v) => set({ ...s, logo_url: v })} folder="logos" accept="image/*" />
          <div><Label>Alt text</Label><Input value={s.alt_text ?? ""} onChange={(e) => set({ ...s, alt_text: e.target.value })} /></div>
          <ColorField label="Background color" value={s.bg_color ?? "#FFFFFF"} onChange={(v) => set({ ...s, bg_color: v })} />
          <div><Label>Sort order</Label><Input type="number" value={s.sort_order ?? 0} onChange={(e) => set({ ...s, sort_order: Number(e.target.value) })} /></div>
        </>
      )}
    />
  );
}

function CertificationsSection({ nicheId, rows, onChange }: any) {
  return (
    <CrudShell
      title="Certifications" table="certifications" rows={rows} onChange={onChange}
      emptyState={() => ({ niche_id: nicheId, name: "", issuer: "", date_earned: null, badge_url: "", credential_link: "", sort_order: 0 })}
      validate={(s) => (!s.name ? "Name required" : null)}
      renderRow={(r) => (
        <>
          <div className="font-medium truncate">{r.name}</div>
          <div className="text-sm text-muted-foreground line-clamp-1">{r.issuer} {r.date_earned ? `• ${r.date_earned}` : ""}</div>
        </>
      )}
      renderForm={(s, set) => (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            <div><Label>Name *</Label><Input value={s.name ?? ""} onChange={(e) => set({ ...s, name: e.target.value })} /></div>
            <div><Label>Issuer</Label><Input value={s.issuer ?? ""} onChange={(e) => set({ ...s, issuer: e.target.value })} /></div>
            <div><Label>Date earned</Label><Input type="date" value={s.date_earned ?? ""} onChange={(e) => set({ ...s, date_earned: e.target.value || null })} /></div>
            <div><Label>Credential link</Label><Input value={s.credential_link ?? ""} onChange={(e) => set({ ...s, credential_link: e.target.value })} /></div>
          </div>
          <FileField label="Badge image" value={s.badge_url ?? ""} onChange={(v) => set({ ...s, badge_url: v })} folder="certifications" accept="image/*" />
          <div><Label>Sort order</Label><Input type="number" value={s.sort_order ?? 0} onChange={(e) => set({ ...s, sort_order: Number(e.target.value) })} /></div>
        </>
      )}
    />
  );
}

function SkillsSection({ nicheId, rows, onChange }: any) {
  return (
    <CrudShell
      title="Skills" table="skills" rows={rows} onChange={onChange}
      emptyState={() => ({ niche_id: nicheId, name: "", percentage: 80, icon: "", sort_order: 0 })}
      validate={(s) => (!s.name ? "Name required" : null)}
      renderRow={(r) => (
        <>
          <div className="font-medium truncate">{r.name}</div>
          <div className="text-sm text-muted-foreground">{r.percentage}%</div>
        </>
      )}
      renderForm={(s, set) => (
        <>
          <div><Label>Name *</Label><Input value={s.name ?? ""} onChange={(e) => set({ ...s, name: e.target.value })} /></div>
          <div><Label>Percentage (0-100)</Label><Input type="number" min={0} max={100} value={s.percentage ?? 0} onChange={(e) => set({ ...s, percentage: Number(e.target.value) })} /></div>
          <div><Label>Icon</Label><Input value={s.icon ?? ""} onChange={(e) => set({ ...s, icon: e.target.value })} /></div>
          <div><Label>Sort order</Label><Input type="number" value={s.sort_order ?? 0} onChange={(e) => set({ ...s, sort_order: Number(e.target.value) })} /></div>
        </>
      )}
    />
  );
}

function SocialLinksSection({ nicheId, rows, onChange }: any) {
  return (
    <CrudShell
      title="Social links" table="social_links" rows={rows} onChange={onChange}
      emptyState={() => ({ niche_id: nicheId, platform: "", url: "", icon: "", sort_order: 0 })}
      validate={(s) => (!s.platform ? "Platform required" : !s.url ? "URL required" : null)}
      renderRow={(r) => (
        <>
          <div className="font-medium truncate">{r.platform}</div>
          <div className="text-sm text-muted-foreground line-clamp-1">{r.url}</div>
        </>
      )}
      renderForm={(s, set) => (
        <>
          <div><Label>Platform *</Label><Input value={s.platform ?? ""} onChange={(e) => set({ ...s, platform: e.target.value })} placeholder="Twitter, LinkedIn, GitHub…" /></div>
          <div><Label>URL *</Label><Input value={s.url ?? ""} onChange={(e) => set({ ...s, url: e.target.value })} /></div>
          <div><Label>Icon</Label><Input value={s.icon ?? ""} onChange={(e) => set({ ...s, icon: e.target.value })} /></div>
          <div><Label>Sort order</Label><Input type="number" value={s.sort_order ?? 0} onChange={(e) => set({ ...s, sort_order: Number(e.target.value) })} /></div>
        </>
      )}
    />
  );
}

function EmailDesignsSection({ nicheId, rows, limit, onChange }: any) {
  return (
    <CrudShell
      title="Email designs" table="email_designs" rows={rows} limit={limit} onChange={onChange} starrable
      emptyState={() => ({ niche_id: nicheId, title: "", client_name: "", description: "", preview_url: "", sort_order: 0, is_starred: false })}
      validate={(s) => (!s.title ? "Title required" : !s.preview_url ? "Preview image required" : null)}
      renderRow={(r) => (
        <>
          <div className="font-medium truncate">{r.title}</div>
          <div className="text-sm text-muted-foreground line-clamp-1">{r.client_name}</div>
        </>
      )}
      renderForm={(s, set) => (
        <>
          <div><Label>Title *</Label><Input value={s.title ?? ""} onChange={(e) => set({ ...s, title: e.target.value })} /></div>
          <div><Label>Client name</Label><Input value={s.client_name ?? ""} onChange={(e) => set({ ...s, client_name: e.target.value })} /></div>
          <div><Label>Description</Label><Textarea rows={3} value={s.description ?? ""} onChange={(e) => set({ ...s, description: e.target.value })} /></div>
          <FileField label="Preview image *" value={s.preview_url ?? ""} onChange={(v) => set({ ...s, preview_url: v })} folder="email-designs" accept="image/*" />
          <div><Label>Sort order</Label><Input type="number" value={s.sort_order ?? 0} onChange={(e) => set({ ...s, sort_order: Number(e.target.value) })} /></div>
        </>
      )}
    />
  );
}

/* ------------------------- NEW NICHE ------------------------- */

function NewNicheCard({ onCreated }: { onCreated: (slug: string) => void }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [slug, setSlug] = useState("");
  const [tagline, setTagline] = useState("");
  const [primary, setPrimary] = useState("#2563EB");
  const [accent, setAccent] = useState("#F59E0B");
  const [heroBg, setHeroBg] = useState("");
  const [busy, setBusy] = useState(false);

  function autoSlug(v: string) {
    setDisplayName(v);
    if (!slug || slug === toSlug(displayName)) setSlug(toSlug(v));
  }

  async function create() {
    if (!displayName || !slug) { toast.error("Display name and slug are required"); return; }
    setBusy(true);
    try {
      const { data: existing } = await supabase.from("niches").select("id").eq("slug", slug).maybeSingle();
      if (existing) throw new Error("That slug is already taken");

      const { data: niche, error } = await supabase.from("niches")
        .insert({ slug, display_name: displayName, sort_order: 99, is_active: true })
        .select().single();
      if (error) throw error;

      await supabase.from("niche_settings").insert({
        niche_id: niche.id,
        full_name: "Ogbeifun Daniel Osewe",
        title: displayName,
        hero_tagline: tagline || `Welcome to my ${displayName} portfolio.`,
        primary_color: primary,
        accent_color: accent,
        hero_background_url: heroBg || null,
      });

      const sections = [
        { section_name: "services", max_display: 6 },
        { section_name: "projects", max_display: 6 },
        { section_name: "testimonials", max_display: 6 },
        { section_name: "brand_logos", max_display: 8 },
      ];
      await supabase.from("niche_homepage_limits").insert(
        sections.map((s) => ({ niche_id: niche.id, ...s }))
      );

      toast.success(`Niche "${displayName}" created`);
      qc.invalidateQueries({ queryKey: ["niches"] });
      onCreated(slug);
      setOpen(false);
      setDisplayName(""); setSlug(""); setTagline(""); setHeroBg("");
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  }

  if (!open) {
    return (
      <Card>
        <CardContent className="flex items-center justify-between py-4">
          <div>
            <div className="font-medium">Add a new niche</div>
            <div className="text-xs text-muted-foreground">Create another professional identity</div>
          </div>
          <Button onClick={() => setOpen(true)} variant="outline">
            <Plus className="mr-1 h-4 w-4" /> New niche
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle>New niche</CardTitle></CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div><Label>Display name *</Label><Input value={displayName} onChange={(e) => autoSlug(e.target.value)} placeholder="Photographer" /></div>
        <div>
          <Label>URL slug *</Label>
          <Input value={slug} onChange={(e) => setSlug(toSlug(e.target.value))} placeholder="photographer" />
          <p className="mt-1 text-xs text-muted-foreground">Public URL: /niche/{slug || "your-slug"}</p>
        </div>
        <div className="md:col-span-2"><Label>Hero tagline</Label><Input value={tagline} onChange={(e) => setTagline(e.target.value)} /></div>
        <div className="md:col-span-2">
          <FileField label="Hero background image" value={heroBg} onChange={setHeroBg} folder="hero" accept="image/*" />
        </div>
        <ColorField label="Primary color" value={primary} onChange={setPrimary} />
        <ColorField label="Accent color" value={accent} onChange={setAccent} />
        <div className="md:col-span-2 flex gap-2">
          <Button onClick={create} disabled={busy}>{busy ? "Creating…" : "Create niche"}</Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function toSlug(v: string) {
  return v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
