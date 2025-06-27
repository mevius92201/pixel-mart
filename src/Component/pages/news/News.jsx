import { Outlet, Link } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import "../../../assets/news.css";
import NewsCard from "./NewsCard";
import FilterTabs from "../../FilterTabs";
import LoadingEffectV2 from "../../LoadingEffectV2";
// const newsCategory = 1;
function News() {
  // const params = useParams();
  // console.log(params);
  // const { id } = params;
  // const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [pinnedNews, setPinnedNews] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState("");
  const [tabs, setTab] = useState(["全部", "公告", "活動", "道具解析"]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  // const handleTabChange = (tab) => {
  //   setSelectedTab(tab);
  //   setPage(1); // Reset to the first page when changing tabs
  // };
  const getNewsList = async () => {
    const category = selectedTab === "全部" ? "" : selectedTab;
    try {
      setLoading(true);
      const res = await axios.get(`https://getnews-3xt565hwvq-uc.a.run.app`, {
        params: {
          page,
          category,
          pageSize: 10,
          isPublic: true,
        },
      });
      setNewsList(res.data.data.news);
      setPinnedNews(res.data.data.pinned);
      console.log(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getNewsList();
  }, [selectedTab, page]);

  // let timestamp;
  // const date = new Date(timestamp);
  // const formattedDate = date.toLocaleDateString({
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  // });

  // function handleNavigate(e, news) {
  //   e.preventDefault();
  //   navigate(news.id);
  // }
  return (
    <>
      <section className="news-list">
        <div className="news-list-main-wrapper">
          <div className="news-list-header">
            <FilterTabs
              tabs={tabs}
              activeTab={selectedTab}
              onChange={setSelectedTab}
            />
          </div>
          <div className="news-list-group">
            {pinnedNews.length > 0 && (
              <div className="news-list-pinned">
                {pinnedNews.map((news) => (
                  <NewsCard key={news.id} news={news} isPinned={true} />
                ))}
              </div>
            )}
            {newsList.length > 0 ? (
              newsList.map((news) => <NewsCard key={news.id} news={news} />)
            ) : (
              <div className="no-news">沒有最新消息</div>
            )}
            <Outlet />
          </div>
        </div>
      </section>
      <div>
        <LoadingEffectV2 loadingState={loading} />
      </div>
    </>
  );
}
export default News;
