<template>
  <div class="card">
    <div class="border-0 card-header">
      <h3 class="mb-0">Users</h3>
    </div>

    <el-table class="table-responsive table-flush"
              header-row-class-name="thead-light"
              :data="projects.slice(0, itemLimit)">
      <el-table-column label="Name"
                       min-width="310px"
                       prop="name"
                       >
        <template v-slot="{row}">
          <div class="media align-items-center">
            <a href="#" class="avatar rounded-circle mr-3">
              <img alt="Image placeholder" :src="row.img">
            </a>
            <div class="media-body">
              <span class="font-weight-600 name mb-0 text-sm">{{row.title}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Email"
                       prop="budget"
                       min-width="140px"
                       >
      </el-table-column>

      <el-table-column label="Phone Number"
                       min-width="170px"
                       prop="status"
                       >
        <template v-slot="{row}">
          <badge class="badge-dot mr-4" type="">
            <i :class="`bg-${row.statusType}`"></i>
            <span class="status">{{row.status}}</span>
          </badge>
        </template>
      </el-table-column>


      <el-table-column label="Subscription Package"
                       prop="completion"
                       min-width="240px"
                       >
        <template v-slot="{row}">
          <div class="d-flex align-items-center">
            <span class="completion mr-2">{{row.completion}}%</span>
            <div>
              <base-progress :type="row.statusType" :value="row.completion"/>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Payment Type"
                       prop="completion"
                       min-width="240px"
                       >
        <template v-slot="{row}">
          <div class="d-flex align-items-center">
            <span class="completion mr-2">{{row.completion}}%</span>
            <div>
              <base-progress :type="row.statusType" :value="row.completion"/>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Status"
                       prop="status"
                       min-width="240px"
                       >
        <template v-slot="{row}">
          <badge class="badge-dot mr-4" type="">
            <i :class="`bg-${row.statusType}`"></i>
            <span class="status">{{row.status}}</span>
          </badge>
        </template>
      </el-table-column>
      <el-table-column min-width="180px">
        <template v-slot="{row}">
          <el-dropdown trigger="click" class="dropdown">
            <span class="btn btn-sm btn-icon-only text-light" aria-label="Dropdown menu">
              <i class="fas fa-ellipsis-v mt-2"></i>
            </span>
            <el-dropdown-menu class="dropdown-menu dropdown-menu-arrow show"
                              role="list"
                              slot="dropdown">
              <a class="dropdown-item" href="#">View User</a>
              <a class="dropdown-item" href="#">Status</a>
              <a class="dropdown-item" href="#">Something else here</a>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import { Table, TableColumn, DropdownMenu, DropdownItem, Dropdown } from 'element-ui'

  export default {
    name: 'light-table',
    components: {
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Dropdown.name]: Dropdown,
      [DropdownItem.name]: DropdownItem,
      [DropdownMenu.name]: DropdownMenu,
    },
    props: {
      itemLimit: {
        type: Number,
        default: 9
      }
    },
    data() {
      return {
        projects: [
          {
            img: 'img/theme/bootstrap.jpg',
            title: 'Argon Design System',
            budget: '$2500 USD',
            status: 'pending',
            statusType: 'warning',
            completion: 60
          },
          {
            img: 'img/theme/angular.jpg',
            title: 'Angular Now UI Kit PRO',
            budget: '$1800 USD',
            status: 'completed',
            statusType: 'success',
            completion: 100
          },
          {
            img: 'img/theme/sketch.jpg',
            title: 'Black Dashboard',
            budget: '$3150 USD',
            status: 'delayed',
            statusType: 'danger',
            completion: 72
          },
          {
            img: 'img/theme/react.jpg',
            title: 'React Material Dashboard',
            budget: '$4400 USD',
            status: 'on schedule',
            statusType: 'info',
            completion: 90
          },
          {
            img: 'img/theme/vue.jpg',
            title: 'Vue Paper UI Kit PRO',
            budget: '$2200 USD',
            status: 'completed',
            statusType: 'success',
            completion: 100
          },
          {
            img: 'img/theme/bootstrap.jpg',
            title: 'Argon Design System',
            budget: '$2500 USD',
            status: 'pending',
            statusType: 'warning',
            completion: 60
          },
          {
            img: 'img/theme/angular.jpg',
            title: 'Angular Now UI Kit PRO',
            budget: '$1800 USD',
            status: 'completed',
            statusType: 'success',
            completion: 100
          },
          {
            img: 'img/theme/sketch.jpg',
            title: 'Black Dashboard',
            budget: '$3150 USD',
            status: 'delayed',
            statusType: 'danger',
            completion: 72
          },
          {
            img: 'img/theme/vue.jpg',
            title: 'Vue Paper UI Kit PRO',
            budget: '$2200 USD',
            status: 'completed',
            statusType: 'success',
            completion: 100
          }
        ],
        currentPage: 1
      };
    }
  }
</script>
