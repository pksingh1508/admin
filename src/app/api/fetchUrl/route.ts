import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { success: 0, message: 'URL parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Validate URL format
    const urlObj = new URL(url);
    
    // Add protocol if missing
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      // Add timeout
      signal: AbortSignal.timeout(10000), // 10 seconds timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    // Extract meta information from HTML
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
                           html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const imageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
                      html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);

    const linkData = {
      success: 1,
      link: targetUrl,
      meta: {
        title: titleMatch ? titleMatch[1].trim() : urlObj.hostname,
        description: descriptionMatch ? descriptionMatch[1].trim() : '',
        image: {
          url: imageMatch ? imageMatch[1] : ''
        }
      }
    };

    return NextResponse.json(linkData);
  } catch (error) {
    console.error('Error fetching URL:', error);
    
    // Return a basic response even if fetching fails
    const fallbackUrl = url.startsWith('http') ? url : `https://${url}`;
    return NextResponse.json({
      success: 1,
      link: fallbackUrl,
      meta: {
        title: fallbackUrl,
        description: '',
        image: {
          url: ''
        }
      }
    });
  }
}
