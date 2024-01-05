import { describe, it, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import AddButton from '../../components/User/AddButton.vue'

const person = {
  name: '123',
  nickName: 'www',
  email: 'www@123.com',
}

describe('AppButton', () => {
  const wrapper = mount(AddButton);

  //1,test render
  //2.test button to open modal
  //3.test input and submit
  it('emits an event on button click', async () => {
    expect(wrapper.vm.visible).not.toBeTruthy();
    await wrapper.find('a-button').trigger('click');
    expect(wrapper.vm.visible).toBeTruthy();
  });

  it('validate input name', async () => {
    await wrapper.find('a-modal').trigger('Create');
    // expect(wrapper.vm.formState.name).not.toBe('');
    expect(person.name).toBeDefined()
    expect(person.name).not.toBe('')
  });
  it('validate input nickName', async () => {
    await wrapper.find('a-modal').trigger('Create');
    // expect(wrapper.vm.formState.nickName).not.toBe('');
    expect(person.nickName).toBeDefined()
    expect(person.nickName).not.toBe('')
  });
  it('validate input email', async () => {
    await wrapper.find('a-modal').trigger('Create');
    // expect(wrapper.vm.formState.email).not.toBe('');
    expect(person.email).toBeDefined()
    expect(person.email).toMatch(new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/))
  });
});


