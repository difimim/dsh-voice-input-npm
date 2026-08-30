// dsh-voice-input · 浏览器半（dsh.client 插件）。
// 通过 window.__ModuleLoader__ 加载；Node 半见 lib/index.js。
window.__ModuleLoader__.load({
  id: "@difimim/dsh-voice-input",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    var react = require("react");

    var VOICE_CSS = "\n.dsh-voice-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 28px;\n  height: 28px;\n  padding: 0;\n  border: 1px solid transparent;\n  border-radius: 999px;\n  background: transparent;\n  color: var(--dsw-alias-label-secondary, #8a8f98);\n  cursor: pointer;\n  flex: none;\n  transition: color .15s ease, background-color .15s ease;\n}\n.dsh-voice-btn:hover:not(:disabled) {\n  color: var(--dsw-alias-brand-primary, #4f6ef7);\n  background-color: var(--dsw-alias-bg-layer-2, rgba(0,0,0,.06));\n}\n.dsh-voice-btn:disabled {\n  opacity: .45;\n  cursor: not-allowed;\n}\n.dsh-voice-btn.is-listening {\n  color: var(--dsw-alias-state-error-primary, #e5484d);\n  animation: dsh-voice-pulse 1.5s ease-in-out infinite;\n}\n.dsh-voice-btn.is-listening:hover:not(:disabled) {\n  color: var(--dsw-alias-state-error-primary, #e5484d);\n  background-color: transparent;\n}\n.dsh-voice-btn.has-fault {\n  color: var(--dsw-alias-state-warn-primary, #f5a623);\n}\n@keyframes dsh-voice-pulse {\n  0%, 100% { box-shadow: 0 0 0 0 rgba(229, 72, 77, .35); }\n  50% { box-shadow: 0 0 0 6px rgba(229, 72, 77, 0); }\n}\n";

    var inject = ["slots"];

    function MicGlyph() {
      return react.createElement("svg", {
        viewBox: "0 0 24 24", width: 16, height: 16, fill: "none",
        stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
        "aria-hidden": true
      },
        react.createElement("path", { d: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" }),
        react.createElement("path", { d: "M19 10v2a7 7 0 0 1-14 0v-2" }),
        react.createElement("line", { x1: 12, y1: 19, x2: 12, y2: 23 }),
        react.createElement("line", { x1: 8, y1: 23, x2: 16, y2: 23 })
      );
    }

    function StopGlyph() {
      return react.createElement("svg", {
        viewBox: "0 0 24 24", width: 14, height: 14, fill: "currentColor", "aria-hidden": true
      }, react.createElement("rect", { x: 6, y: 6, width: 12, height: 12, rx: 2 }));
    }

    function VoiceInputButton(props) {
      var listeningPair = react.useState(false);
      var listening = listeningPair[0];
      var setListening = listeningPair[1];
      var faultPair = react.useState(null);
      var fault = faultPair[0];
      var setFault = faultPair[1];
      var recRef = react.useRef(null);
      var baseRef = react.useRef("");
      var finalRef = react.useRef("");

      var w = typeof window === "undefined" ? null : window;
      var supported = w !== null && !!(w.SpeechRecognition || w.webkitSpeechRecognition);

      react.useEffect(function () {
        return function () {
          var rec = recRef.current;
          if (rec) {
            rec.onresult = null;
            rec.onerror = null;
            rec.onend = null;
            try { rec.abort(); } catch (e) {}
          }
        };
      }, []);

      function writeDraft(text) {
        var actions = props.inputActions;
        if (actions && typeof actions.setDraft === "function") actions.setDraft(text);
      }

      function start() {
        var win = typeof window === "undefined" ? null : window;
        var Ctor = win && (win.SpeechRecognition || win.webkitSpeechRecognition);
        if (!Ctor) { setFault("unsupported"); return; }
        var rec = new Ctor();
        rec.lang = "zh-CN";
        rec.continuous = true;
        rec.interimResults = true;
        baseRef.current = (props.input && typeof props.input.draft === "string") ? props.input.draft : "";
        finalRef.current = "";
        rec.onresult = function (event) {
          var interim = "";
          for (var i = event.resultIndex; i < event.results.length; i++) {
            var r = event.results[i];
            var text = (r && r[0] && r[0].transcript) ? r[0].transcript : "";
            if (r.isFinal) finalRef.current += text;
            else interim += text;
          }
          writeDraft(baseRef.current + finalRef.current + interim);
        };
        rec.onerror = function (event) {
          setFault(event.error || "error");
          setListening(false);
        };
        rec.onend = function () {
          setListening(false);
          recRef.current = null;
        };
        recRef.current = rec;
        try {
          rec.start();
          setListening(true);
          setFault(null);
        } catch (e) {
          setFault("start-failed");
          setListening(false);
        }
      }

      function stop() {
        var rec = recRef.current;
        if (rec) { try { rec.stop(); } catch (e) {} }
        setListening(false);
      }

      function toggle() {
        if (listening) stop();
        else start();
      }

      var label = listening ? "停止语音输入" : "语音输入";
      var title = supported ? label : "当前浏览器不支持语音识别（请使用 Chrome / Edge）";
      return react.createElement("button", {
        type: "button",
        className: "dsh-voice-btn" + (listening ? " is-listening" : "") + (fault ? " has-fault" : ""),
        title: title,
        "aria-label": label,
        "aria-pressed": listening,
        disabled: !supported,
        onClick: toggle
      }, listening ? StopGlyph() : MicGlyph());
    }

    function apply(ctx) {
      ctx.effect(function () {
        var tag = document.createElement("style");
        tag.dataset.plugin = "@difimim/dsh-voice-input";
        tag.textContent = VOICE_CSS;
        document.head.appendChild(tag);
        return function () { tag.remove(); };
      });
      ctx.slots.inject("conversation.input.left", function () {
        return ctx.slots.register(
          { name: "conversation.input.left", id: "dsh-voice-input", order: 5 },
          VoiceInputButton
        );
      });
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  }
});
