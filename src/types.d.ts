export interface Screen {
    title: string;
    description: string;
  }
  
  export interface ScreenCategory {
    title: string;
    screens: Screen[];
  }