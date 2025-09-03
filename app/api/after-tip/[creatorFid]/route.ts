    import { NextRequest, NextResponse } from 'next/server';
    import { base } from 'viem/chains';
    import { createPublicClient, http, formatEther } from 'viem';
    import { neynar } from '@/lib/neynar';
    import { supabase } from '@/lib/supabase';

    const publicClient = createPublicClient({
      chain: base,
      transport: http(),
    });

    export async function POST(req: NextRequest, { params }: { params: { creatorFid: string } }) {
      const body = await req.json();
      // Placeholder for frame validation

      // Assume transaction hash is in body
      const txHash = body.transactionHash;
      if (!txHash) {
        return NextResponse.json({
          message: 'Transaction failed or cancelled',
          success: false
        });
      }

      // Fetch transaction details
      const tx = await publicClient.getTransaction({ hash: txHash });
      const amount = formatEther(tx.value);
      const creatorAddress = tx.to;

      // Verify it's to the correct creator
      const fid = parseInt(params.creatorFid);
      const { user } = await neynar.lookUpUserByFid(fid);
      const verified = user.verified_addresses?.eth_addresses.some(addr => addr.toLowerCase() === creatorAddress.toLowerCase());

      if (!verified) {
        return NextResponse.json({ message: 'Invalid transaction' }, { status: 400 });
      }

      // Upsert fan
      const fanFid = body.fanFid || 0;
      const fanUser = await neynar.lookUpUserByFid(fanFid);
      await supabase.from('fans').upsert({
        fanId: fanFid,
        farcasterId: fanFid,
        displayName: fanUser.user.display_name,
        profilePictureUrl: fanUser.user.pfp_url,
        walletAddress: body.walletAddress,
      });

      // Upsert creator
      await supabase.from('creators').upsert({
        creatorId: fid,
        farcasterId: fid,
        displayName: user.display_name,
        profilePictureUrl: user.pfp_url,
        bio: user.profile?.bio?.text || '',
        walletAddress: creatorAddress,
      });

      // Record tip
      const { error } = await supabase.from('tips').insert({
        creatorId: fid,
        fanId: fanFid,
        amount,
        currency: 'ETH',
        transactionHash: txHash,
        timestamp: new Date().toISOString(),
        message: body.message || '',
      });

      if (error) console.error(error);

      return NextResponse.json({
        message: 'Tip recorded successfully',
        success: true
      });
    }
  