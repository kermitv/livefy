Great. Let’s make Ollama on your Mac reliable, fast, and easy to use with Livefy.
	1.	Confirm Ollama is installed

In Terminal:

which ollama
ollama --version

If which returns nothing, install it:

brew install ollama

	2.	Start the Ollama server (manual for now)

In one terminal window:

ollama serve

You should see it listening on 127.0.0.1:11434. Leave this running.
	3.	Pick a model that fits your M1 (16 GB)

Given your earlier memory pressure, start with a small, responsive model.

Option A (fast + light, good for extraction/summaries):

ollama pull phi3
ollama run phi3

Option B (also good, small and strong):

ollama pull qwen2.5:3b
ollama run qwen2.5:3b

I’d start with phi3 first.
	4.	Quick sanity test (in the ollama run prompt)

Paste this:

Extract decisions, open loops, and next actions from:
“I’ll defer where OpenClaw runs until later. Build Livefy inbox UI first. Install Ollama on Mac. Consider Vercel capture from phone.”

If it responds quickly and your Mac stays responsive, you’re in the right model size.
	5.	See what’s running and stop models when done

In another terminal:

ollama ps

To stop a running model:

ollama stop phi3
# or
ollama stop qwen2.5:3b

This matters on a 16 GB Mac. Stopping the model frees memory immediately.
	6.	Test the local API (this is what Livefy will call later)

With the server running, try:

curl http://127.0.0.1:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model":"phi3",
    "prompt":"Return JSON with keys decisions, open_loops, next_actions for: Build inbox UI. Defer OpenClaw hosting. Install Ollama.",
    "stream": false
  }'

If you get a JSON response back, your Mac is ready for Livefy integration.
	7.	Recommended “AI mode” defaults for your Mac

When you’re actively using Ollama:
	•	use Safari, close Edge
	•	quit Docker Desktop unless you need it
	•	keep one VS Code window/workspace
	•	watch swap: keep it under ~2 GB if possible

Next step

Tell me what you want to optimize for on the Mac:
	1.	fastest responses (best UX for Livefy extraction)
	2.	better reasoning even if slower

And paste the output of:

ollama --version
ollama list

Then I’ll recommend 1–2 exact models to keep, and we’ll wire Livefy’s Extract button to the API with minimal code changes.