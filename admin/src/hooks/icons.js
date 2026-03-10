// utils/icons.js
import {
  UserIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ClipboardDocumentIcon,
  ShieldCheckIcon,
} from "@heroicons/vue/24/outline";

export const getIconComponent = (iconName) => {
  switch (iconName) {
    case "UserIcon":
      return UserIcon;
    case "AcademicCapIcon":
      return AcademicCapIcon;
    case "BriefcaseIcon":
      return BriefcaseIcon;
    case "ClipboardDocumentIcon":
      return ClipboardDocumentIcon;
    case "ShieldCheckIcon":
      return ShieldCheckIcon;
    default:
      return UserIcon; // default fallback
  }
};
