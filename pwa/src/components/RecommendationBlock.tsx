interface RecommendationBlockProps {
  title: string;
  body: string;
  priority: string;
}

export function RecommendationBlock({ title, body, priority }: RecommendationBlockProps) {
  return (
    <aside className="recommendation-block">
      <p className="overline">{priority}</p>
      <h3>{title}</h3>
      <p>{body}</p>
    </aside>
  );
}
