import puppeteer from 'puppeteer';
import ejs from 'ejs';
import fs from 'fs/promises';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const POST = async (request) => {
  try {
    const body = await request.json();

    const templatePath = path.resolve(process.cwd(), 'templates', 'surgeryForm.ejs');
    const template = await fs.readFile(templatePath, 'utf-8');
    const html = ejs.render(template, { data: body });

    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 1600 });
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const imageBuffer = await page.screenshot({ type: 'png', fullPage: true });
    await browser.close();

    const recordId = body.recordId;
    if (!recordId) {
      return new Response(JSON.stringify({ error: 'Missing recordId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const form = new FormData();
    form.append('file', imageBuffer, {
      filename: `surgery_${Date.now()}.png`,
      contentType: 'image/png',
    });

    const fixedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZUlkIjoxLCJzdGFmZklkIjoxMSwicGF0aWVudElkIjpudWxsLCJmdWxsbmFtZSI6IlRy4bqnbiBRdeG7kWMgVuG7uSIsImlhdCI6MTc1MDQwNjIyNSwiZXhwIjoxNzUwNDA5ODI1fQ.0iMri-Uq8X0CUHjUcY1pgOyc_BRCT4iX57A12PdYBrE';

    const uploadUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL2}/upload/diagnosis/record/${recordId}`;
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${fixedToken}`,
      },
      body: form,
    });

    if (!uploadResponse.ok) {
      const errText = await uploadResponse.text();
      return new Response(JSON.stringify({ error: 'Upload failed', detail: errText }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const uploadResult = await uploadResponse.json();
    return new Response(JSON.stringify(uploadResult), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ Export/Upload Error (surgery):', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
