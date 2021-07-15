export class TreeNode<T> {
  public id: string;
  public parentId: string;
  public label: string;
  public data: T;
  public children: TreeNode<T>[];
  public expanded: boolean;
  public selected: boolean;
  public checked: boolean;
  public indeterminate: boolean;
  public isLazyLoaded: boolean;
  public loadingChildren: boolean;
}
