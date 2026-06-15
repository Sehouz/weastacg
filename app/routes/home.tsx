import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "东西动漫社 - 中南财经政法大学" },
    { name: "description", content: "中南财经政法大学东西动漫社，一群热爱二次元的伙伴，用画笔、键盘和热情，描绘属于我们的幻想世界。" },
    { property: "og:title", content: "东西动漫社 - 中南财经政法大学" },
    { property: "og:description", content: "东西动漫社是中南财经政法大学的学生社团，聚集了各种ACG爱好者。" },
  ];
}

export default function Home() {
  return <Welcome />;
}
