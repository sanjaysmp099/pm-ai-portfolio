// Vercel serverless function.
// This runs on the server, NOT in the browser — so your API key stays hidden.
// Set ANTHROPIC_API_KEY as an Environment Variable in your Vercel project settings.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { data } = req.body;
  if (!data || typeof data !== 'string') {
    return res.status(400).json({ error: 'No data provided' });
  }

  const systemPrompt = `You are a data governance analyst supporting a Program Manager who owns Offer/Service data quality (similar to PIM / product-service taxonomy governance in an industrial B2B context).

Given a raw list of product/service attribute rows, produce a governance report with these exact sections, in markdown:

## Completeness Score
One line: "<X>% of entries have all mandatory attributes populated." Mandatory attributes are: linked Product, linked Service, a defined Voltage/Spec Range, and a Compliance Cert.

## Issues Found
A markdown table with columns: | Entry | Issue Type | Severity | Suggested Fix | Suggested Owner |
- Issue Type is one of: Missing Attribute, Naming Inconsistency, Orphaned Relationship
- Severity is High, Medium, or Low (High = compliance-relevant gap like missing cert; Medium = missing spec data; Low = naming inconsistency)
- Suggested Owner should be a plausible role, e.g. "Offer Data Leader", "Product Owner", "Data Steward"

## Top 3 Risk Areas
A short bulleted list of the most systemic issues (e.g. recurring naming variants, a product line with many gaps).

## Recommended Governance Cadence
2-3 sentences recommending a review cadence and process fix to prevent recurrence.

Be concise, specific, and reference actual entries from the data provided. Do not invent data not present in the input.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        system: systemPrompt,
        messages: [
          { role: 'user', content: `Here is the data to analyze:\n\n${data}` }
        ]
      })
    });

    const result = await response.json();

    if (result.error) {
      return res.status(500).json({ error: result.error.message || 'API error' });
    }

    const textBlock = result.content.find(block => block.type === 'text');
    const report = textBlock ? textBlock.text : 'No report generated.';

    return res.status(200).json({ report });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
