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
            content: "You are an expert agricultural AI that identifies crop types and diseases from images. Analyze the image carefully and provide: 1) The specific crop type (e.g., 'Tomato', 'Wheat', 'Rice', 'Corn', 'Potato'), 2) Whether the crop appears HEALTHY or has DISEASE symptoms, 3) If disease is present, identify the specific disease name and type (bacterial, viral, fungal, or nutritional deficiency). Be accurate and specific about the disease name if you detect one."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this crop image and determine: 1) The crop type, 2) If the crop is healthy or diseased, 3) If diseased, identify the specific disease name and type. Return a JSON object with: cropType (string), isHealthy (boolean), diseaseName (string or null - specific disease name if detected), diseaseType (string or null: 'bacterial', 'viral', 'fungal', 'nutritional'), and confidence (number 0-1)."
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
      
      // Add 5-second delay before returning diagnosis
      await new Promise(resolve => setTimeout(resolve, 5000));
      
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
