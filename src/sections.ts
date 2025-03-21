import type { ComponentProps, ReactNode } from 'react';
import {
  ReactIcon,
  AngularIcon,
  AndroidIcon,
  AppleIcon,
  FlutterIcon,
  HTMLIcon,
  JSIcon,
} from './icons';

export type Section = { docId: string } & (
  | {
      section: false;
    }
  | {
      section: string;
      icon: (props: ComponentProps<'svg'>) => ReactNode;
      name: string;
    }
);

const SECTIONS: Section[] = [
  {
    name: 'React',
    docId: 'react',
    icon: ReactIcon,
    section: 'web-prebuilt',
  },
  {
    name: 'JavaScript',
    docId: 'javascript',
    icon: JSIcon,
    section: 'web-prebuilt',
  },

  // Plugin SDKs
  // - web
  {
    name: 'Javascript',
    docId: 'plugin-sdk',
    icon: JSIcon,
    section: 'plugin-sdk',
  },

  // Web SDKs
  // - web-ui-kit
  {
    name: 'Web Components',
    docId: 'ui-kit',
    icon: HTMLIcon,
    section: 'web-ui-kit',
  },
  {
    name: 'React UI Kit',
    docId: 'react-ui-kit',
    icon: ReactIcon,
    section: 'web-ui-kit',
  },
  {
    name: 'Angular UI Kit',
    docId: 'angular-ui-kit',
    icon: AngularIcon,
    section: 'web-ui-kit',
  },

  // - web-core-sdk
  {
    name: 'JavaScript',
    docId: 'web-core',
    icon: JSIcon,
    section: 'web-core-sdk',
  },
  {
    name: 'React',
    docId: 'react-web-core',
    icon: ReactIcon,
    section: 'web-core-sdk',
  },
  // Mobile SDKs
  {
    name: 'Android Core',
    docId: 'android-core',
    icon: AndroidIcon,
    section: 'mobile-core',
  },
  {
    name: 'iOS Core',
    docId: 'ios-core',
    icon: AppleIcon,
    section: 'mobile-core',
  },
  {
    name: 'Flutter Core',
    docId: 'flutter-core',
    icon: FlutterIcon,
    section: 'mobile-core',
  },
  {
    name: 'React Native Core',
    docId: 'rn-core',
    icon: ReactIcon,
    section: 'mobile-core',
  },
  {
    name: 'Android',
    docId: 'android',
    icon: AndroidIcon,
    section: 'mobile-ui-kit',
  },
  {
    name: 'iOS',
    docId: 'ios',
    icon: AppleIcon,
    section: 'mobile-ui-kit',
  },
  {
    name: 'Flutter',
    docId: 'flutter',
    icon: FlutterIcon,
    section: 'mobile-ui-kit',
  },
  {
    name: 'React Native',
    docId: 'react-native',
    icon: ReactIcon,
    section: 'mobile-ui-kit',
  },
];

export type SectionsGroup = {
  name: string;
  section: string;
  description?: string;
  className?: string;
};

const SECTION_GROUPS: SectionsGroup[][] = [
  [
    {
      name: 'UI Kit',
      section: 'web-prebuilt',
      className: 'deprecated-badge',
    },
  ],
];

export { SECTIONS, SECTION_GROUPS };
