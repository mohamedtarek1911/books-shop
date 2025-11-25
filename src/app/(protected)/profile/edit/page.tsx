"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profileSchema,
  type ProfileFormValues,
} from "@/lib/validators/profile";
import { useToast } from "@/components/ui/ToastProvider";
import { useI18n } from "@/lib/i18n/context";

export default function EditProfilePage() {
  const router = useRouter();
  const { pushToast } = useToast();
  const { t } = useI18n();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", email: "" },
  });

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/profile");
      if (!res.ok) return;
      const user = await res.json();
      form.reset({ name: user.name, email: user.email });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(values: ProfileFormValues) {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const error = await res
        .json()
        .catch(() => ({ message: t.profile.updateFailed }));
      pushToast(error.message || t.profile.updateFailed, "error");
      return;
    }

    pushToast(t.profile.profileUpdated, "success");
    router.push("/profile");
    router.refresh(); // Refresh to update navbar with new name/email
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 p-4">
      <h1 className="text-2xl font-semibold text-foreground">
        {t.profile.editProfile}
      </h1>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 rounded-lg border border-border bg-card p-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-card-foreground">
            {t.profile.name} <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-card-foreground">
            {t.profile.email} <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-foreground hover:bg-accent"
          >
            {t.common.cancel}
          </button>
          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {form.formState.isSubmitting ? t.profile.saving : t.common.save}
          </button>
        </div>
      </form>
    </div>
  );
}
