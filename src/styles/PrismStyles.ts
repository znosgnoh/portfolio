import { css } from 'styled-components';

const PrismStyles = css`
  code[class*='language-'],
  pre[class*='language-'] {
    color: var(--lightest-slate);
    background: none;
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;
    -moz-tab-size: 2;
    -o-tab-size: 2;
    tab-size: 2;
    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
  }

  pre[class*='language-'] {
    padding: 1em;
    margin: 0.5em 0;
    overflow: auto;
    border-radius: var(--border-radius);
    background-color: var(--lightest-navy);
  }

  :not(pre) > code[class*='language-'] {
    padding: 0.1em;
    border-radius: 0.3em;
    white-space: normal;
    background: var(--lightest-navy);
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: var(--slate);
  }
  .token.punctuation {
    color: var(--light-slate);
  }
  .token.namespace {
    opacity: 0.7;
  }
  .token.property,
  .token.tag,
  .token.constant,
  .token.symbol,
  .token.deleted {
    color: #f57dff;
  }
  .token.boolean,
  .token.number {
    color: var(--green);
  }
  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: var(--green);
  }
  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string,
  .token.variable {
    color: var(--white);
  }
  .token.atrule,
  .token.attr-value,
  .token.function,
  .token.class-name {
    color: #57cbff;
  }
  .token.keyword {
    color: var(--green);
  }
  .token.regex,
  .token.important {
    color: #ffd700;
  }
`;

export default PrismStyles;
