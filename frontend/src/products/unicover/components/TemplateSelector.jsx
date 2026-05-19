function TemplateSelector({ templateType, setTemplateType }) {

  return (
    <div className="template-header">
      <div className="template-selector top-selector">

        <label className="template-option">
          <input
            type="radio"
            name="templateType"
            value="auto"
            checked={templateType === "auto"}
            onChange={(e) => setTemplateType(e.target.value)}
          />
          <div className="template-card">
            <span className="template-icon">📄</span>
            <div className="template-info">
              <span className="template-name">Auto-Filled (Filled)</span>
              <span className="template-desc">Download ready to print</span>
            </div>
          </div>
        </label>

        <label className="template-option">
          <input
            type="radio"
            name="templateType"
            value="hand"
            checked={templateType === "hand"}
            onChange={(e) => setTemplateType(e.target.value)}
          />
          <div className="template-card">
            <span className="template-icon">✍️</span>
            <div className="template-info">
              <span className="template-name">Fill by Hand (Blank)</span>
              <span className="template-desc">Empty fields with writing lines</span>
            </div>
          </div>
        </label>

      </div>
    </div>
  );
}

export default TemplateSelector;