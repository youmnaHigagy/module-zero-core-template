﻿import { AppComponentBase } from "shared/app-component-base";
import { Injector, OnInit, AfterViewInit } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base'

export class PagedAndSortedRequestDto extends PagedRequestDto {
    sorting: string;
}

export abstract class PagedAndSortedListingComponentBase<EntityDto> extends PagedListingComponentBase<EntityDto> implements AfterViewInit {
    protected sortColumn: string = "";
    protected sortDirection: string = "ASC";

    ngAfterViewInit() {
        $.getScript('assets/js/arrowDirection.js');
    }

    order(sort: string) {
        this.sortDirection == "DESC" ? this.sortDirection = "ASC" : this.sortDirection = "DESC";
        this.sortColumn = sort ;
        this.refresh();
    }

    public getDataPage(page: number): void {
        var req = new PagedAndSortedRequestDto();
        req.maxResultCount = this.pageSize;
        req.skipCount = (page - 1) * this.pageSize;
        if (this.sortColumn != "") {
            req.sorting = this.sortColumn + " " + this.sortDirection;;
        }
        this.isTableLoading = true;
        this.list(req, page, () => {
            this.isTableLoading = false;
        });
    }

    protected abstract list(request: PagedAndSortedRequestDto, pageNumber: number, finishedCallback: Function): void;
}