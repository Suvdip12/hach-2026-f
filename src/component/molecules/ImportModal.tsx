"use client";

import { ImportModalProps } from "../../types/blockly";
import { useTranslation } from "@/i18n";
import "./css/ImportModal.css";

export const ImportModal = ({
  showImportModal,
  setShowImportModal,
  importCode,
  setImportCode,
}: ImportModalProps) => {
  const { t } = useTranslation();

  if (!showImportModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">{t("codeEditor.importPythonCode")}</h3>
          <p className="modal-description">
            {t("codeEditor.pasteCodeToConvert")}
          </p>
        </div>

        <div className="modal-body">
          <textarea
            className="modal-textarea"
            placeholder={`# ${t("codeEditor.enterPythonCode")}
if x > 5:
    print('Hello World')
    result = 10 + 20`}
            value={importCode}
            onChange={(e) => setImportCode(e.target.value)}
          />
        </div>

        <div className="modal-footer">
          <button
            onClick={() => {
              setShowImportModal(false);
              setImportCode("");
            }}
            className="modal-button modal-button-cancel"
          >
            {t("codeEditor.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};
