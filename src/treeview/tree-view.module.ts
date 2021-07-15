import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeViewComponent } from './treeview.component';
import { TreeNodeComponent } from './treenode/treenode.component';
import { TreeNode } from './model/tree-node';
import { FormsModule } from '@angular/forms';
import { ArrowRightComponent } from './icon-components/arrow-right/arrow-right.component';
import { ArrowBottomComponent } from './icon-components/arrow-bottom/arrow-bottom.component';
import { IconLoadingComponent } from './icon-components/icon-loading/icon-loading.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [
    TreeViewComponent,
    TreeNodeComponent,
    ArrowRightComponent,
    ArrowBottomComponent,
    IconLoadingComponent
  ],
  exports: [TreeViewComponent]
})
export class TreeViewModule {}
