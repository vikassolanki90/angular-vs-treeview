import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { TreeConfig } from './model/tree-config';
import { TreeNode } from './model/tree-node';

@Component({
  selector: 'treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.css']
})
export class TreeViewComponent implements OnChanges {
  @Input('treeItems') treeItems: TreeNode<any>[];
  @Input('treeConfig') treeConfig: TreeConfig;

  @Output() onNodeSelected = new EventEmitter<TreeNode<any>>();
  @Output() onLazyLoadNodeExpand = new EventEmitter<TreeNode<any>>();

  constructor() {}

  public ngOnChanges(changes: SimpleChanges) {
    console.log('node changes');
    if (changes.treeItems && changes.treeItems.currentValue) {
      changes.treeItems.currentValue.forEach((node, i) => {
        node.parentId = null;
        node.id = i + 1;
        this.setIdsToTreeview(node);
      });
    }
  }

  public nodeArrowClicked(node: TreeNode<any>) {
    if (node.isLazyLoaded) {
      node.loadingChildren = true;
      this.onLazyLoadNodeExpand.emit(node);
      return;
    }
    node.expanded = !node.expanded;
  }

  public nodeSelected(node: TreeNode<any>) {
    this.treeItems.forEach(node => {
      this.changeSelectedProperty(node, false);
    });
    node.selected = true;
    this.onNodeSelected.emit(node);
  }

  public treeNodeCheckChanged(treeNode: TreeNode<any>) {
    if (treeNode.children){
      // check all children same status as current checked
      treeNode.children.forEach(node => {
        node.checked = treeNode.checked;
      });
    }
    // set parent node of current node check / intermediate / uncheck accoding to childrens.
    const parentTreeNode = this.getTreeNode(this.treeItems, treeNode.parentId);
    if (parentTreeNode) {
      this.setParentTreeNodeCheckboxStatusAccordingToChildren(parentTreeNode);
      // const checkedLength = parentTreeNode.children.filter(x => x.checked)
      //   .length;
      // const allChecked = checkedLength === parentTreeNode.children.length;
      // parentTreeNode.checked = allChecked;
      // parentTreeNode.indeterminate =
      //   !parentTreeNode.checked && checkedLength > 0;
    }
  }

  // mostly call from container / parent to load lazy loaded children
  public setChildren(node: TreeNode<any>, children: TreeNode<any>[]) {
    node.isLazyLoaded = false;
    node.children = children;
    node.loadingChildren = false;
    this.setIdsToTreeview(node);
    node.expanded = true;
  }

  private changeSelectedProperty(treeNode: TreeNode<any>, selected: boolean) {
    treeNode.selected = selected;
    if (treeNode.children)
      treeNode.children.forEach(node => {
        this.changeSelectedProperty(node, selected);
      });
  }

  private setIdsToTreeview(treeNode: TreeNode<any>) {
    if (treeNode.children) {
      treeNode.children.forEach((node, i) => {
        node.parentId = treeNode.id;
        node.id = node.parentId.toString() + '_' + (i + 1);
        //console.log(node.parentId.toString() + '_' + (i + 1));
        this.setIdsToTreeview(node);
      });
    }
  }

  private setParentTreeNodeCheckboxStatusAccordingToChildren(
    parentTreeNode: TreeNode<any>
  ) {
    if (parentTreeNode) {
      const checkedLength = parentTreeNode.children.filter(x => x.checked)
        .length ?? 0;
      const intermediateCheckedLength = parentTreeNode.children.filter(
        x => x.indeterminate
      ).length ?? 0;
      const allChecked = checkedLength === parentTreeNode.children.length;
      parentTreeNode.checked = allChecked;
      parentTreeNode.indeterminate =
        !parentTreeNode.checked && (checkedLength+intermediateCheckedLength) > 0;
    }
    if (parentTreeNode.parentId) {
      parentTreeNode = this.getTreeNode(
        this.treeItems,
        parentTreeNode.parentId
      );
      this.setParentTreeNodeCheckboxStatusAccordingToChildren(parentTreeNode);
    }
  }

  private getTreeNode(treeNodes: TreeNode<any>[], id: string) {
    if (treeNodes && treeNodes.length > 0) {
      for (let i = 0; i < treeNodes.length; i++) {
        if (treeNodes[i].id === id) {
          console.log(treeNodes[i].id);
          return treeNodes[i];
          break;
        }
        return this.getTreeNode(treeNodes[i].children, id);
      }
    }
    return null;
  }
}
