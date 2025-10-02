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
    
    if (!imageData) {
      return new Response(
        JSON.stringify({ error: "No image data provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
            content: "You are an expert agricultural AI that identifies crop types and diseases from images. Analyze the image and provide: 1) The specific crop type (e.g., 'Tomato', 'Wheat', 'Rice', 'Corn', 'Potato'), 2) Whether you detect any disease signs, 3) If disease is present, identify the disease type (bacterial, viral, fungal, or nutritional deficiency). Be specific and accurate. If you cannot identify the crop or disease with confidence, say so."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Identify the crop type in this image and check if there are any disease symptoms visible. Return a JSON object with: cropType (string), hasDisease (boolean), diseaseType (string or null: 'bacterial', 'viral', 'fungal', 'nutritional', or null), and confidence (number 0-1)."
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
                  hasDisease: {
                    type: "boolean",
                    description: "Whether disease symptoms are visible"
                  },
                  diseaseType: {
                    type: "string",
                    enum: ["bacterial", "viral", "fungal", "nutritional", "unknown"],
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
                required: ["cropType", "hasDisease", "confidence"],
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
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to analyze image" }),
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

    return new Response(
      JSON.stringify({ error: "Failed to parse AI response" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-crop function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
