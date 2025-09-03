    import { connectWallet, sendTransaction, getWalletClient } from 'wagmi/actions';
    import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
    import { Button } from "@/components/ui/button";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { neynar } from "@/lib/neynar";
    import { supabase } from "@/lib/supabase";
    import { parseEther, formatEther } from 'viem';

    interface Props {
      params: { creatorFid: string };
    }

    export default async function CreatorProfile({ params }: Props) {
      const fid = parseInt(params.creatorFid);
      let creator;
      try {
        const { user } = await neynar.lookUpUserByFid(fid);
        creator = user;
      } catch (error) {
        return <div>Error loading creator profile.</div>;
      }

      if (!creator) return <div>Creator not found.</div>;

      const verifiedAddresses = creator.verified_addresses?.eth_addresses || [];
      const walletAddress = verifiedAddresses[0] || '0x0000000000000000000000000000000000000000'; // Fallback

      // Upsert creator in Supabase
      await supabase.from('creators').upsert({
        creatorId: fid,
        farcasterId: fid,
        displayName: creator.display_name,
        profilePictureUrl: creator.pfp_url,
        bio: creator.profile?.bio?.text || '',
        walletAddress,
      });

      // Get tips summary
      const { data: tips, error } = await supabase
        .from('tips')
        .select('amount')
        .eq('creatorId', fid);

      if (error) console.error(error);

      const totalTips = tips?.reduce((sum, tip) => sum + parseFloat(tip.amount), 0) || 0;

      return (
        <div className="container max-w-md px-4 mx-auto py-8">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={creator.pfp_url} alt={creator.display_name} />
                  <AvatarFallback>{creator.display_name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{creator.display_name}</CardTitle>
                  <CardDescription>@{creator.username}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-body">{creator.profile?.bio?.text || 'No bio available.'}</p>
              <p className="mt-4 text-caption">Total Tips Received: {totalTips} ETH</p>
              <Button className="mt-4">Tip Creator</Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  