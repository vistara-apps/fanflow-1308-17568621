    import { ImageResponse } from '@vercel/og';
    import { NextRequest } from 'next/server';

    export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
      const [type, id] = params.path;

      let text = '';
      if (type === 'creator') {
        text = `Creator Profile - FID ${id}`;
      } else if (type === 'fan') {
        text = `Fan Profile - FID ${id}`;
      } else if (type === 'confirmation') {
        text = 'Thank you for tipping!';
      } else if (type === 'error') {
        text = 'Transaction failed. Try again.';
      } else {
        text = 'FanFlow';
      }

      return new ImageResponse(
        (
          <div
            style={{
              fontSize: 48,
              background: 'hsl(210, 36%, 96%)',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'hsl(210, 15%, 25%)',
            }}
          >
            {text}
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }
  