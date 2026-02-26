"use client";

import "./css/Assignmentdrawer.css";
import toast from "react-hot-toast";

import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Check,
  X,
  HelpCircle,
  CloudCog,
} from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import { useState, useMemo } from "react";
import type { Assignment, Question } from "@/services/api.service";
import { Markdown } from "../atoms/Markdown";

type AssignmentWithQuestion = Assignment & {
  questionDetails?: Question;
};

interface AssignmentDrawerProps {
  assignments: AssignmentWithQuestion[];
  selectedAssignmentId: string;
  onAssignmentChange: (id: string) => void;
  loadingAssignments: boolean;
  selectedAssignment?: AssignmentWithQuestion;
  question?: Question;
  isCompleted: boolean;

  // Kept for prop compatibility, but not used in UI anymore
  showHints: boolean;
  setShowHints: (show: boolean) => void;
  showTestCases: boolean;
  setShowTestCases: (show: boolean) => void;

  onSubmit: () => void;
  submitting: boolean;
  onMarkAsSolved: () => void;
  markingSolved: boolean;
  hasSuccessfulRun?: boolean;
}

export const AssignmentDrawer = ({
  assignments,
  selectedAssignmentId,
  onAssignmentChange,
  loadingAssignments,
  selectedAssignment,
  question,
  isCompleted,
  onSubmit,
  submitting,
  onMarkAsSolved,
  markingSolved,
  hasSuccessfulRun = false,
}: AssignmentDrawerProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  // Deduplicate assignments based on ID to prevent dropdown duplicates
  const uniqueAssignments = useMemo(() => {
    const seen = new Set();
    return assignments.filter((a) => {
      if (seen.has(a.id)) return false;
      seen.add(a.id);
      return true;
    });
  }, [assignments]);

  // Data Helpers
  const hints = question?.answer?.hints || [];
  const hasHints = hints.length > 0;

  if (assignments.length === 0) {
    if (loadingAssignments) {
      return (
        <div className={`assignment-drawer ${isCollapsed ? "collapsed" : ""}`}>
          <div className="assignment-drawer-header">
            <h3 className="assignment-drawer-title">Assignment</h3>
          </div>
          <div
            className="assignment-drawer-content"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "60px",
              height: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                className="spinner"
                style={{
                  border: "3px solid #f3f3f3",
                  borderTop: "3px solid var(--orange-9)",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
              <span>Loading assignments...</span>
            </div>
          </div>
          <style jsx>{`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      <div className={`assignment-drawer ${isCollapsed ? "collapsed" : ""}`}>
        <div className="assignment-drawer-header">
          {!isCollapsed && (
            <h3 className="assignment-drawer-title">Assignment</h3>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="collapse-button"
            aria-label={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        </div>

        {!isCollapsed && (
          <div className="assignment-drawer-content">
            {/* 1. Assignment Selector */}
            <div className="assignment-selector">
              <label className="assignment-label">Select Mission:</label>
              <div style={{ position: "relative" }}>
                <select
                  value={selectedAssignmentId}
                  onChange={(e) => onAssignmentChange(e.target.value)}
                  disabled={loadingAssignments}
                  className="assignment-select"
                >
                  {loadingAssignments ? (
                    <option>Loading...</option>
                  ) : (
                    uniqueAssignments.map((assignment, index) => (
                      <option key={assignment.id} value={assignment.id}>
                        {index + 1}.{" "}
                        {assignment.questionDetails?.question?.substring(
                          0,
                          25,
                        ) || `Mission ${assignment.assignmentLevel}`}
                        ...
                        {(assignment.isAssignmentCompleted ||
                          assignment.isQuestionCompleted) &&
                          " ✓"}
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown
                  size={14}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    color: "var(--gray-11)",
                  }}
                />
              </div>
            </div>

            {/* 2. Mission Card */}
            {selectedAssignment && (
              <div className="mission-card">
                <h2 className="mission-title">
                  Mission {selectedAssignment.assignmentLevel}:{" "}
                  {question?.question || "Assignment"}
                </h2>
              </div>
            )}

            {/* Task Description */}
            {question && (
              <div className="section">
                <h3 className="section-title">Task</h3>
                <Markdown
                  content={question.description || ""}
                  className="section-text"
                />
              </div>
            )}

            {/* Reflection */}
            <div className="reflection-card">
              <h3 className="reflection-title">Reflection:</h3>
              <p className="reflection-text">
                What will happen when you click Run?
              </p>
            </div>
          </div>
        )}

        {/* Footer with fixed buttons */}
        {!isCollapsed && (
          <div className="assignment-drawer-footer-actions">
            <div style={{ display: "flex", gap: "10px", width: "100%" }}>
              {hasHints && (
                <button
                  onClick={() => setShowHelpDialog(true)}
                  className="secondary-button"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    color: "var(--orange-11)",
                    borderColor: "var(--orange-6)",
                    background: "var(--orange-2)",
                  }}
                >
                  <HelpCircle size={14} />
                  Need Help?
                </button>
              )}
              <button
                onClick={() => {
                  if (!hasSuccessfulRun && !isCompleted) {
                    toast.error(
                      "Please run your code successfully at least once before submitting.",
                    );
                    return;
                  }
                  onMarkAsSolved();
                }}
                disabled={markingSolved || isCompleted}
                className={`mark-done-button ${isCompleted ? "completed" : ""} ${!hasSuccessfulRun && !isCompleted ? "not-run" : ""}`}
                style={{ flex: 1 }}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 size={16} /> Solved
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    {markingSolved ? "Marking..." : "Mark as Solved"}
                  </>
                )}
              </button>
            </div>

            {/* Hidden Submit Button - kept for logic */}
            <button
              onClick={onSubmit}
              disabled={submitting || isCompleted || !selectedAssignmentId}
              className="submit-button"
              style={{ display: "none" }}
            >
              {submitting
                ? "Submitting..."
                : isCompleted
                  ? "Submitted ✓"
                  : "Submit Solution"}
            </button>
          </div>
        )}
      </div>

      {/* --- Help/Hint Dialog --- */}
      {showHelpDialog && (
        <div
          className="hints-dialog-overlay"
          onClick={() => setShowHelpDialog(false)}
        >
          {/* Renamed to 'hints-dialog' */}
          <div className="hints-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="hints-dialog-header">
              <h3>Here are some hints</h3>
              <button
                onClick={() => setShowHelpDialog(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--gray-11)",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="hints-dialog-content">
              {/* Hint List */}
              <Accordion.Root type="multiple" className="AccordionRoot">
                {hints.map((hint: string, idx: number) => (
                  <Accordion.Item
                    key={idx}
                    value={`item-${idx + 1}`}
                    className="AccordionItem"
                  >
                    <Accordion.Header className="AccordionHeader">
                      <Accordion.Trigger className="AccordionTrigger">
                        <span>Hint {idx + 1}</span>
                        <ChevronDown className="AccordionChevron" size={16} />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="AccordionContent">
                      <div className="AccordionContentText">{hint}</div>
                    </Accordion.Content>
                  </Accordion.Item>
                ))}
              </Accordion.Root>

              <button
                onClick={() => setShowHelpDialog(false)}
                className="login-button"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
