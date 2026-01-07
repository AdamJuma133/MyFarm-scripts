import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    
    // Validate image data presence and type
    if (!imageData || typeof imageData !== 'string') {
      return new Response(
        JSON.stringify({ error: "Invalid image data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate data URL format
    if (!imageData.startsWith('data:image/')) {
      return new Response(
        JSON.stringify({ error: "Only image data URLs are accepted" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate image size (max 10MB)
    const base64Data = imageData.split(',')[1];
    if (!base64Data) {
      return new Response(
        JSON.stringify({ error: "Invalid image format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const approximateSizeMB = (base64Data.length * 0.75) / (1024 * 1024);
    if (approximateSizeMB > 10) {
      console.warn(`Image too large: ${approximateSizeMB.toFixed(2)}MB`);
      return new Response(
        JSON.stringify({ error: "Image too large (max 10MB)" }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Call Lovable AI with vision capabilities
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert agricultural botanist and plant pathologist AI. Your task is to precisely identify plants/crops and diagnose diseases from leaf and plant images.

PLANT IDENTIFICATION GUIDELINES:
- Look at leaf shape, venation pattern, margins (edges), texture, and arrangement
- Consider stem structure, color, and growth habit
- Note any flowers, fruits, or seeds visible
- Identify specific species when possible (e.g., "Roma Tomato" not just "Tomato")

COMMON CROPS TO IDENTIFY:
Vegetables: Tomato, Potato, Pepper (Bell, Chili), Eggplant, Cucumber, Squash, Zucchini, Pumpkin, Cabbage, Lettuce, Spinach, Kale, Broccoli, Cauliflower, Carrot, Onion, Garlic, Bean, Pea, Okra
Grains: Corn/Maize, Wheat, Rice, Barley, Sorghum, Millet, Oat
Fruits: Apple, Orange, Lemon, Grape, Strawberry, Banana, Mango, Papaya, Guava, Watermelon, Melon
Cash Crops: Cotton, Coffee, Tea, Sugarcane, Tobacco, Cocoa, Cassava
Legumes: Soybean, Peanut/Groundnut, Chickpea, Lentil, Cowpea

DISEASE IDENTIFICATION:
- Check for spots, lesions, discoloration, wilting, mold, rust, blight
- Note the pattern and distribution of symptoms
- Identify specific disease names (e.g., "Early Blight", "Powdery Mildew", "Bacterial Leaf Spot")

Be PRECISE and SPECIFIC. If uncertain, provide your best assessment with lower confidence.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this plant/crop image carefully.

STEP 1 - PLANT IDENTIFICATION:
- What specific plant or crop is this? Look at the leaf shape, texture, color, vein patterns, and any visible fruits/flowers.
- Be as specific as possible (e.g., "Cherry Tomato", "Bell Pepper", "Sweet Corn")

STEP 2 - HEALTH ASSESSMENT:
- Is this plant HEALTHY or showing signs of DISEASE/STRESS?
- Look for: spots, lesions, yellowing, browning, wilting, mold, unusual patterns

STEP 3 - DISEASE DIAGNOSIS (if applicable):
- What specific disease is affecting this plant?
- What type: bacterial, viral, fungal, or nutritional deficiency?
- Look at symptom patterns to determine the exact disease name

Return a JSON object with:
- cropType: specific plant/crop name (string)
- isHealthy: true if healthy, false if diseased (boolean)  
- diseaseName: specific disease name if detected, null if healthy (string or null)
- diseaseType: 'bacterial', 'viral', 'fungal', or 'nutritional' if diseased (string or null)
- confidence: your confidence level 0-1 (number)
- observations: brief notes on what you observed (string)`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "identify_crop",
              description: "Identify crop type and disease from image",
              parameters: {
                type: "object",
                properties: {
                  cropType: {
                    type: "string",
                    description: "The specific crop identified (e.g., 'Tomato', 'Wheat', 'Rice')"
                  },
                  isHealthy: {
                    type: "boolean",
                    description: "Whether the crop appears healthy (true) or diseased (false)"
                  },
                  diseaseName: {
                    type: "string",
                    description: "Specific disease name if detected (e.g., 'Late Blight', 'Powdery Mildew')"
                  },
                  diseaseType: {
                    type: "string",
                    enum: ["bacterial", "viral", "fungal", "nutritional"],
                    description: "Type of disease if present"
                  },
                  confidence: {
                    type: "number",
                    description: "Confidence level 0-1"
                  },
                  observations: {
                    type: "string",
                    description: "Brief observations about the crop condition"
                  }
                },
                required: ["cropType", "isHealthy", "confidence"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "identify_crop" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn("Rate limit exceeded for AI gateway");
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        console.warn("AI credits exhausted");
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      // Log detailed error server-side only
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      // Return generic error to client
      return new Response(
        JSON.stringify({ error: "Analysis service temporarily unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    
    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log detailed error server-side
    console.error("Failed to parse AI response");
    return new Response(
      JSON.stringify({ error: "Unable to process image analysis" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Log detailed error server-side only
    console.error("Error in analyze-crop function:", error);
    // Return generic error to client
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
