export const REGEX_NAME = /^[A-Za-z\s]{2,100}$/;

export const REGEX_FULL_NAME = /^[A-Za-z\s]{4,30}$/;

export const REGEX_USERNAME = /^[a-zA-Z0-9-]{5,40}$/;

export const REGEX_PHONE = /^\+?[0-9\s\-().]{7,20}$/;

export const REGEX_NATIONALITY = /^[A-Za-z\s-]{2,60}$/;

export const REGEX_PLACE = /^[A-Za-z0-9\s]{2,50}$/;

export const REGEX_ADDRESSLINE = /^[A-Za-z0-9\s]{2,50}$/;

export const REGEX_LANDMARK = /^[A-Za-z0-9\s,.\-#/]{4,100}$/;

export const REGEX_INDUSTRY = /^[A-Za-z\s&.-]{2,100}$/;

export const REGEX_COUNTRY = /^[A-Za-z\s]{2,60}$/;

export const REGEX_URL = /^https?:\/\/[^\s]{9,250}$/;

export const REGEX_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,50}$/;

export const REGEX_HASHED_PASSWORD =
  /^\$2[aby]?\$\d{2}\$[./A-Za-z0-9]{53}$/;

export const REGEX_TEXT_DOT_AMP =
  /^[A-Za-z0-9\s.&-]{2,100}$/;

export const REGEX_LONG_TEXT = /^.{10,5000}$/s;

export const REGEX_FEATURE = /^[A-Za-z0-9 .&-]{1,200}$/;

export const REGEX_POSTAL = /^[0-9]{3,10}$/;

export const REGEX_S3_FILEKEY =
/^(resumes|profiles|packages|payments)\/[A-Za-z0-9._\-/]{1,500}$/;

export const REGEX_PROFESSIONAL_STATUS = /^[A-Za-z0-9\s.&-]{2,100}$/;

export const REGEX_CLIENT_NAME = /^[A-Za-z\s]{2,100}$/;

export const REGEX_TESTIMONIAL = /^.{20,1000}$/s;

export const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const REGEX_ENTITY_ID = /^[A-Za-z0-9-_]{1,100}$/;

export const REGEXT_NOTE_TEXT = /^.{0,500}$/s;

export const REGEX_DESCRIPTION = /^.{10,1000}$/s;

export const REGEXT_CHAT_MESSAGE = /^[\p{L}\p{N}\p{P}\p{Zs}]{1,500}$/u;

export const REGEX_BENEFITS = /^[A-Za-z0-9\s,.\-&/@#%*!?]{1,500}$/;

export const REGEX_SKILLS = /^[A-Za-z0-9\s,.\-&+()]{1,500}$/;

export const REGEX_EXPERIENCE = /^[A-Za-z0-9\s.,&()\-_/+#!@]{2,500}$/;

export const REGEX_COMPANY_NAME = /^[A-Za-z0-9\s.&\-()]{2,100}$/;
