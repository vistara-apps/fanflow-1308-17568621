    import { NextRequest, NextResponse } from 'next/server';
    import { parseEther } from 'viem';
    import { neynar } from '@/lib/neynar';

    // Note: For actual tip sending, use wagmi or viem directly
    export async function POST(req: NextRequest, { params }: { params: { creatorFid: string } }) {
      const body = await req.json();
      // This is a placeholder for frame validation, adjust as needed
      
      const fid = parseInt(params.creatorFid);
      const { user } = await neynar.lookUpUserByFid(fid);
      const verifiedAddresses = user.verified_addresses?.eth_addresses || [];
      const creatorAddress = verifiedAddresses.find(addr => addr.toLowerCase().startsWith('0x'));

      if (!creatorAddress) {
        return NextResponse.json({ message: 'Creator has no verified address' }, { status: 400 });
      }

      // Get amount from body
      const amountStr = body.amount;
      if (!amountStr) {
        return NextResponse.json({ message: 'Amount required' }, { status: 400 });
      }

      let amount;
      try {
        amount = parseEther(amountStr);
      } catch (error) {
        return NextResponse.json({ message: 'Invalid amount' }, { status: 400 });
      }

      return NextResponse.json({
        chainId: 'eip155:8453',
        method: 'eth_sendTransaction',
        params: {
          to: creatorAddress,
          value: amount.toString(),
          data: '0x',
        },
      });
    }
  