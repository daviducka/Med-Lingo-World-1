import React, { useState } from "react";
import { useGetUserProfile, useUpdateUserProfile, useListLanguages } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Profile() {
  const { data: profile, isLoading } = useGetUserProfile({ query: { queryKey: ['/api/users/profile'] } });
  const { data: languages } = useListLanguages();
  const updateProfile = useUpdateUserProfile();

  const [displayName, setDisplayName] = useState(profile?.displayName || "");
  const [selectedLanguage, setSelectedLanguage] = useState(profile?.selectedLanguage || "en");

  React.useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setSelectedLanguage(profile.selectedLanguage);
    }
  }, [profile]);

  const handleSave = () => {
    updateProfile.mutate({
      data: {
        displayName,
        selectedLanguage
      }
    });
  };

  if (isLoading || !profile) return <Skeleton className="w-full h-[600px] rounded-3xl" />;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black tracking-tight">Profile Settings</h1>

      <div className="bg-card border-2 rounded-3xl p-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-primary/20 object-cover bg-muted" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-primary/10 text-primary flex items-center justify-center text-4xl font-bold border-4 border-primary/20">
              {profile.displayName.charAt(0)}
            </div>
          )}
          
          <div className="flex-1 space-y-2 w-full text-center md:text-left">
            <h2 className="text-2xl font-black">{profile.username}</h2>
            <p className="text-muted-foreground font-bold">Joined {new Date(profile.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="space-y-6 pt-6 border-t">
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Display Name</label>
            <Input 
              value={displayName} 
              onChange={e => setDisplayName(e.target.value)} 
              className="h-14 text-lg font-bold rounded-xl bg-muted/50 border-2 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Learning Language</label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="h-14 text-lg font-bold rounded-xl bg-muted/50 border-2">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {languages?.map(lang => (
                  <SelectItem key={lang.code} value={lang.code} className="font-bold text-lg py-3">
                    {lang.flagEmoji} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            size="lg" 
            onClick={handleSave} 
            disabled={updateProfile.isPending || (displayName === profile.displayName && selectedLanguage === profile.selectedLanguage)}
            className="w-full h-14 text-lg font-bold rounded-xl"
          >
            {updateProfile.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
