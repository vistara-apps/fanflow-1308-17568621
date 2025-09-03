    import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { neynar } from "@/lib/neynar";
    import { supabase } from "@/lib/supabase";

    interface Props {
      params: { fanFid: string };
    }

    export default async function FanProfile({ params }: Props) {
      const fid = parseInt(params.fanFid);
      let fan;
      try {
        const { user } = await neynar.lookUpUserByFid(fid);
        fan = user;
      } catch (error) {
        return <div>Error loading fan profile.</div>;
      }

      if (!fan) return <div>Fan not found.</div>;

      const verifiedAddresses = fan.verified_addresses?.eth_addresses || [];
      const walletAddress = verifiedAddresses[0] || '0x0000000000000000000000000000000000000000';

      // Upsert fan in Supabase
      await supabase.from('fans').upsert({
        fanId: fid,
        farcasterId: fid,
        displayName: fan.display_name,
        profilePictureUrl: fan.pfp_url,
        walletAddress,
      });

      // Get transaction history
      const { data: tips, error } = await supabase
        .from('tips')
        .select('*')
        .eq('fanId', fid)
        .order('timestamp', { ascending: false });

      if (error) console.error(error);

      return (
        <div className="container max-w-md px-4 mx-auto py-8">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={fan.pfp_url} alt={fan.display_name} />
                  <AvatarFallback>{fan.display_name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{fan.display_name}</CardTitle>
                  <CardDescription>@{fan.username}</CardDescription>
                </div>
              <div/>
            </CardHeader>
            <CardContent>
              <h2 className="text-heading">Tipping History</h2>
              {tips && tips.length > 0 ? (
                <ul>
                  {tips.map((tip) => (
                    <li key={tip.tipId} className="text-body mt-2">
                      Tipped {tip.amount} ETH to creator {tip.creatorId} on {new Date(tip.timestamp).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tips yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }
  