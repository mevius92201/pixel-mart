import Icon from "./Icon";
export const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        <div className="footer-left-group">
          <div className="footer-game-logo">
            <Icon type="logo" />
          </div>
          <div className="footer-media-icons">
            <Icon type="social_media_fb" />
            <Icon type="social_media_ig" />
            <Icon type="social_media_x" />
            <Icon type="social_media_dc" />
          </div>
        </div>
        <div className="footer-cnt">
          <div className="footer-copyright">
            <span className="footer-copyright-content">
              Copyright © Pixel Mart Online. <br />
              Trademarks belong to their respective owners. All Rights Reserved.{" "}
              <br />
              Copyright © Pixel Mart. All rights reserved.
            </span>
          </div>

          <div className="footer-links-group">
            <a
              href="https://google.com"
              target="_blank"
              className="footer-link_01"
            >
              <div className="footer-symbol">
                <Icon type="info_symbols_01" />
              </div>
              <div className="footer-link-txt_01">授權資訊</div>
            </a>
            <a
              href="https://google.com"
              target="_blank"
              className="footer-link_02"
            >
              <div className="footer-symbol">
                <Icon type="info_symbols_03" />
              </div>
              <div className="footer-link-txt_02">服務條款</div>
            </a>
            <a
              href="https://google.com"
              target="_blank"
              className="footer-link_03"
            >
              <div className="footer-symbol">
                <Icon type="knife_symbols_01" />
              </div>
              <div className="footer-link-txt_03">隱私條款</div>
            </a>
          </div>
        </div>
        <div className="footer-middle-group">
          <div className="footer-mid-content">
            <div className="footer-mid-txt_01"></div>
            <a
              href="https://google.com"
              target="_blank"
              className="footer-mid-link_01"
            >
              <div className="footer-mid-txt_02"></div>
            </a>
            <a
              href="https://google.com"
              target="_blank"
              className="footer-mid-link_01"
            >
              <div className="footer-mid-txt_03"></div>
            </a>
          </div>
        </div>
        <div className="footer-age-symbol">
          <Icon type="age_limit" />
        </div>

        <div className="footer-right-content"></div>
      </div>
    </footer>
  );
};
