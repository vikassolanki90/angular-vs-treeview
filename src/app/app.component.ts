import {
  Component,
  ElementRef,
  OnInit,
  VERSION,
  ViewChild
} from '@angular/core';
import { TreeConfig } from '../treeview/model/tree-config';
import { TreeNode } from '../treeview/model/tree-node';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLazyLoaded: boolean = false;
  @ViewChild('treeView1') treeView1: ElementRef;
  treeItems: TreeNode<string>[] = [];
  treeConfig: TreeConfig = { showCheckbox: false };
  constructor() {}

  ngOnInit() {
    this.treeItems = this.getTree(
      this.getRandomNum(2),
      this.isLazyLoaded,
      !this.isLazyLoaded
    );
    this.treeItems[0].children[0].children = this.getTree(5, this.isLazyLoaded);
  }

  public nodeSelected(node: TreeNode<any>) {
    console.log('Selected Node: ', node);
  }

  public onLazyLoadNodeExpand(node: TreeNode<any>) {
    setTimeout(() => {
      (<any>this.treeView1).setChildren(
        node,
        this.getTree(
          this.getRandomNum(2),
          this.isLazyLoaded,
          !this.isLazyLoaded
        )
      );
    }, 2000);
  }

  /**** (START) Helper Functions for Demo ****/
  public regenerateTree() {
    this.treeItems = this.getTree(
      this.getRandomNum(2),
      this.isLazyLoaded,
      true
    );
  }
  public getTree(
    itemCount: number,
    isLazyLoaded: boolean,
    setChildren = false
  ) {
    const treeItems: TreeNode<string>[] = [];
    for (var i = 1; i <= itemCount; i++) {
      treeItems.push(this.getNode(i, isLazyLoaded, setChildren));
    }
    return treeItems;
  }

  public getNode(i, isLazyLoaded, setChildren = false) {
    const treeNode: TreeNode<string> = new TreeNode<string>();
    treeNode.label = 'Item ' + i;
    treeNode.data = 'Item ' + i;
    treeNode.isLazyLoaded = isLazyLoaded;
    if (setChildren) {
      //if (this.getRandomNum(0) % 5 != 0) {
      treeNode.children = this.getTree(5, isLazyLoaded);
      //}
    }
    return treeNode;
  }

  private getRandomNum(delta: number) {
    return (
      +Math.random()
        .toString()
        .substr(2, 1) + delta
    );
  }

  /**** (END) Helper Functions for Demo ****/
}
