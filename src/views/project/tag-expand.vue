<template>
    <div>
        <span>当前课题下的标签：</span>
        <div v-if="tags.length">
            <Tag 
                type="dot"
                color="primary" 
                v-for="item in tags" 
                :key="item.id">{{item.name}}</Tag>
        </div>
        <span v-else>---</span>
    </div>
</template>

<script>
export default {
    props: {
        tags: {
            type: Array
        }
    }
}
</script>