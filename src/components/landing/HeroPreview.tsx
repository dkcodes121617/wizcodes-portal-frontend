import { AiMlIcon, MobileDevIcon, WebDevIcon } from "@/components/landing/domain-icons";

const TRACKS = [
  {
    id: "web",
    name: "Web Development",
    stack: "React · Node · APIs",
    Icon: WebDevIcon,
    accent: "text-web",
    bg: "bg-web-bg",
  },
  {
    id: "ai",
    name: "AI / ML",
    stack: "Python · Models · Data",
    Icon: AiMlIcon,
    accent: "text-ai",
    bg: "bg-ai-bg",
  },
  {
    id: "mobile",
    name: "Mobile Development",
    stack: "React Native · Hooks",
    Icon: MobileDevIcon,
    accent: "text-mobile",
    bg: "bg-mobile-bg",
  },
] as const;

export function HeroPreview() {
  return (
    <div className="hero-preview">
      <div className="hero-preview-chrome">
        <span className="hero-preview-dot" />
        <span className="hero-preview-dot" />
        <span className="hero-preview-dot" />
        <span className="hero-preview-title">Student dashboard</span>
      </div>

      <div className="hero-preview-body">
        <div className="hero-preview-header">
          <div>
            <p className="hero-preview-label">Active internship</p>
            <p className="hero-preview-heading">Your assigned tasks</p>
          </div>
          <span className="hero-preview-pill">In progress</span>
        </div>

        <ul className="hero-preview-list">
          {TRACKS.map((track) => {
            const { Icon } = track;

            return (
              <li key={track.id} className="hero-preview-row">
                <div className={`hero-preview-icon ${track.bg}`}>
                  <Icon
                    className={`h-5 w-5 ${track.accent}`}
                    idSuffix={`preview-${track.id}`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="hero-preview-track">{track.name}</p>
                  <p className="hero-preview-stack">{track.stack}</p>
                </div>
                <span className={`hero-preview-status ${track.accent}`}>Open</span>
              </li>
            );
          })}
        </ul>

        <div className="hero-preview-footer">
          <span>Certificate on completion</span>
          <span className="text-brand font-medium">View roadmap →</span>
        </div>
      </div>
    </div>
  );
}
